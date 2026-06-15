// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LendingPool
 * @notice Simple lending pool on CELO — deposit cUSD as collateral, borrow CELO
 */
contract LendingPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable cUSD;

    // 150% collateral ratio (borrow up to 66% of deposited value)
    uint256 public constant COLLATERAL_RATIO = 150;
    // 5% annual interest, accrued per second
    uint256 public constant INTEREST_RATE_PER_SECOND = 1585489599; // ~5% APR in 1e18 basis
    uint256 public constant INTEREST_DENOMINATOR = 1e18;
    // cUSD/CELO price: 1 CELO = $0.60 (update via oracle in production)
    uint256 public celoPrice = 60; // in cents

    struct UserAccount {
        uint256 depositedcUSD;    // cUSD deposited as collateral (18 decimals)
        uint256 borrowedCELO;     // CELO borrowed (18 decimals)
        uint256 lastInterestTime; // timestamp of last interest accrual
    }

    mapping(address => UserAccount) public accounts;
    uint256 public totalDepositedcUSD;
    uint256 public totalBorrowedCELO;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event CeloPriceUpdated(uint256 newPrice);

    constructor(address _cUSD) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
    }

    receive() external payable {}

    // ─── Deposit cUSD as collateral ───────────────────────────────────────────

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        cUSD.safeTransferFrom(msg.sender, address(this), amount);

        _accrueInterest(msg.sender);
        accounts[msg.sender].depositedcUSD += amount;
        totalDepositedcUSD += amount;

        emit Deposited(msg.sender, amount);
    }

    // ─── Withdraw cUSD collateral ─────────────────────────────────────────────

    function withdraw(uint256 amount) external nonReentrant {
        UserAccount storage acc = accounts[msg.sender];
        require(amount > 0, "Amount must be > 0");
        require(acc.depositedcUSD >= amount, "Insufficient deposit");

        _accrueInterest(msg.sender);
        uint256 newDeposit = acc.depositedcUSD - amount;
        require(_isSolvent(newDeposit, acc.borrowedCELO), "Would breach collateral ratio");

        acc.depositedcUSD = newDeposit;
        totalDepositedcUSD -= amount;
        cUSD.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    // ─── Borrow CELO against cUSD collateral ──────────────────────────────────

    function borrow(uint256 celoAmount) external nonReentrant {
        require(celoAmount > 0, "Amount must be > 0");
        require(address(this).balance >= celoAmount, "Insufficient pool liquidity");

        _accrueInterest(msg.sender);
        UserAccount storage acc = accounts[msg.sender];
        uint256 newBorrow = acc.borrowedCELO + celoAmount;
        require(_isSolvent(acc.depositedcUSD, newBorrow), "Insufficient collateral");

        acc.borrowedCELO = newBorrow;
        totalBorrowedCELO += celoAmount;

        (bool sent, ) = msg.sender.call{value: celoAmount}("");
        require(sent, "CELO transfer failed");

        emit Borrowed(msg.sender, celoAmount);
    }

    // ─── Repay CELO loan ──────────────────────────────────────────────────────

    function repay() external payable nonReentrant {
        require(msg.value > 0, "Send CELO to repay");
        _accrueInterest(msg.sender);

        UserAccount storage acc = accounts[msg.sender];
        uint256 debt = acc.borrowedCELO;
        require(debt > 0, "No debt to repay");

        uint256 repayAmount = msg.value > debt ? debt : msg.value;
        acc.borrowedCELO -= repayAmount;
        totalBorrowedCELO -= repayAmount;

        // Refund overpayment
        if (msg.value > repayAmount) {
            (bool refunded, ) = msg.sender.call{value: msg.value - repayAmount}("");
            require(refunded, "Refund failed");
        }

        emit Repaid(msg.sender, repayAmount);
    }

    // ─── View functions ───────────────────────────────────────────────────────

    function getAccount(address user) external view returns (
        uint256 depositedcUSD,
        uint256 borrowedCELO,
        uint256 maxBorrowCELO,
        uint256 healthFactor
    ) {
        UserAccount storage acc = accounts[user];
        depositedcUSD = acc.depositedcUSD;
        borrowedCELO = acc.borrowedCELO;
        maxBorrowCELO = _maxBorrow(acc.depositedcUSD);

        if (acc.borrowedCELO == 0) {
            healthFactor = type(uint256).max;
        } else {
            // healthFactor = (collateralValueCents * 100) / (borrowValueCents * COLLATERAL_RATIO)
            uint256 collateralCents = acc.depositedcUSD / 1e16; // cUSD in cents (1 cUSD = 100 cents)
            uint256 borrowCents = (acc.borrowedCELO * celoPrice) / 1e18;
            healthFactor = (collateralCents * 100 * 100) / (borrowCents * COLLATERAL_RATIO);
        }
    }

    function getPoolInfo() external view returns (
        uint256 totalDeposited,
        uint256 totalBorrowed,
        uint256 availableLiquidity
    ) {
        totalDeposited = totalDepositedcUSD;
        totalBorrowed = totalBorrowedCELO;
        availableLiquidity = address(this).balance;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setCeloPrice(uint256 priceInCents) external onlyOwner {
        celoPrice = priceInCents;
        emit CeloPriceUpdated(priceInCents);
    }

    function fundPool() external payable onlyOwner {}

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _accrueInterest(address user) internal {
        UserAccount storage acc = accounts[user];
        if (acc.borrowedCELO == 0 || acc.lastInterestTime == 0) {
            acc.lastInterestTime = block.timestamp;
            return;
        }
        uint256 elapsed = block.timestamp - acc.lastInterestTime;
        uint256 interest = (acc.borrowedCELO * INTEREST_RATE_PER_SECOND * elapsed) / INTEREST_DENOMINATOR;
        acc.borrowedCELO += interest;
        acc.lastInterestTime = block.timestamp;
    }

    function _maxBorrow(uint256 depositedcUSD) internal view returns (uint256) {
        // depositedcUSD in 1e18, celoPrice in cents, CELO in 1e18
        // maxBorrowCELO = (depositedcUSD_cents * 100) / (COLLATERAL_RATIO * celoPrice)
        uint256 depositCents = depositedcUSD / 1e16;
        return (depositCents * 1e18 * 100) / (COLLATERAL_RATIO * celoPrice);
    }

    function _isSolvent(uint256 depositedcUSD, uint256 borrowedCELO) internal view returns (bool) {
        if (borrowedCELO == 0) return true;
        return borrowedCELO <= _maxBorrow(depositedcUSD);
    }
}

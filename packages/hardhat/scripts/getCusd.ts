import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Mento v2 contracts (Celo Mainnet)
  const BROKER          = "0x777A8255cA72412f0d706dc03C9D1987306B4CaD";
  const BI_POOL_MANAGER = "0x22d9db95E6Ae61c104A7B6F6C78D7993B94ec901";
  const GOLD_TOKEN      = "0x471EcE3750Da237f93B8E339c536989b8978a438"; // CELO ERC20
  const CUSD            = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // cUSD / USDm
  const LENDING_POOL    = "0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822";

  const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
  ];

  const BIPOOL_ABI = [
    "function getExchanges() external view returns (tuple(bytes32 exchangeId, address[] assets)[] memory)",
  ];

  const BROKER_ABI = [
    "function swapIn(address exchangeProvider, bytes32 exchangeId, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin) external returns (uint256 amountOut)",
  ];

  const POOL_ABI = [
    "function deposit(uint256 amount) external",
  ];

  const goldToken   = new ethers.Contract(GOLD_TOKEN, ERC20_ABI, deployer);
  const biPool      = new ethers.Contract(BI_POOL_MANAGER, BIPOOL_ABI, deployer);
  const broker      = new ethers.Contract(BROKER, BROKER_ABI, deployer);
  const cusd        = new ethers.Contract(CUSD, ERC20_ABI, deployer);
  const lendingPool = new ethers.Contract(LENDING_POOL, POOL_ABI, deployer);

  console.log("Wallet:", deployer.address);
  const nativeBal = await ethers.provider.getBalance(deployer.address);
  console.log("CELO balance:", ethers.formatEther(nativeBal));

  // Cek saldo cUSD yang sudah ada (dari swap sebelumnya)
  let cusdBal = await cusd.balanceOf(deployer.address);
  console.log("cUSD balance saat ini:", ethers.formatEther(cusdBal));

  // Cari exchange ID untuk CELO/cUSD
  console.log("\nMencari exchange CELO/cUSD...");
  const exchanges = await biPool.getExchanges();

  let exchangeId: string | null = null;
  for (const ex of exchanges) {
    const assets: string[] = ex.assets.map((a: string) => a.toLowerCase());
    if (
      assets.includes(GOLD_TOKEN.toLowerCase()) &&
      assets.includes(CUSD.toLowerCase())
    ) {
      exchangeId = ex.exchangeId;
      console.log("Exchange ID:", exchangeId);
      break;
    }
  }

  if (!exchangeId) {
    console.log("Exchange tidak ditemukan. Semua exchanges:");
    for (const ex of exchanges) {
      console.log(" assets:", ex.assets);
    }
    return;
  }

  const SELL_AMOUNT = ethers.parseEther("0.5"); // 0.5 CELO per swap

  // Lakukan 1 kali swap CELO → cUSD
  console.log(`\n=== Swap 1/1 ===`);

  // Approve Broker
  console.log(`Approve 0.1 CELO ke Broker...`);
  const txApprove = await goldToken.approve(BROKER, SELL_AMOUNT);
  await txApprove.wait();
  console.log("Approve done:", txApprove.hash);

  // Swap CELO → cUSD
  console.log(`Swap 0.1 CELO → cUSD...`);
  const txSwap = await broker.swapIn(
    BI_POOL_MANAGER,
    exchangeId,
    GOLD_TOKEN,
    CUSD,
    SELL_AMOUNT,
    0
  );
  await txSwap.wait();
  console.log("Swap done:", txSwap.hash);

  // Cek total cUSD setelah swap (kadang balanceOf delay)
  cusdBal = await cusd.balanceOf(deployer.address);
  cusdBal = await cusd.balanceOf(deployer.address);
  console.log("\ncUSD total sekarang:", ethers.formatEther(cusdBal));
  console.log("\n=== SELESAI ===");
  console.log("cUSD siap di wallet! Deposit manual via UI CeloLend.");
}

main().catch(console.error);

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const CONTRACT = "0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822";
  const pool = await ethers.getContractAt("LendingPool", CONTRACT);

  console.log("Wallet:", deployer.address);

  const prices = ["0.07", "0.08", "0.07", "0.06", "0.07"];
  const funds = ["0.5", "0.5", "1.0", "0.5", "0.5", "1.0", "0.5", "0.5", "1.0", "0.5"];

  let count = 1;

  for (const price of prices) {
    console.log(`\n[${count}] Set CELO price: $${price}`);
    const tx = await pool.setCeloPrice(ethers.parseUnits(price, 18));
    await tx.wait();
    console.log("Done:", tx.hash);
    count++;
  }

  for (const amount of funds) {
    console.log(`\n[${count}] Fund pool: ${amount} CELO`);
    const tx = await pool.fundPool({ value: ethers.parseEther(amount) });
    await tx.wait();
    console.log("Done:", tx.hash);
    count++;
  }

  console.log(`\nTotal ${count - 1} transaksi selesai!`);
  console.log("https://celoscan.io/address/" + CONTRACT);
}

main().catch(console.error);

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const CONTRACT = "0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822";
  const pool = await ethers.getContractAt("LendingPool", CONTRACT);

  console.log("Wallet:", deployer.address);

  // Tx 1: Update CELO price
  console.log("\n[1/3] Updating CELO price...");
  const tx1 = await pool.setCeloPrice(ethers.parseUnits("0.07", 18));
  await tx1.wait();
  console.log("Done:", tx1.hash);

  // Tx 2: Fund pool 0.01 CELO
  console.log("\n[2/3] Funding pool 0.01 CELO...");
  const tx2 = await pool.fundPool({ value: ethers.parseEther("0.01") });
  await tx2.wait();
  console.log("Done:", tx2.hash);

  // Tx 3: Fund pool 0.01 CELO again
  console.log("\n[3/3] Funding pool 0.01 CELO again...");
  const tx3 = await pool.fundPool({ value: ethers.parseEther("0.01") });
  await tx3.wait();
  console.log("Done:", tx3.hash);

  console.log("\nAll 3 transactions done!");
  console.log("View contract: https://celoscan.io/address/" + CONTRACT);
}

main().catch(console.error);

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const CONTRACT = "0x8AD4A5e535a89C60Ae854f20b5F2d2D1A26aD822";

  const pool = await ethers.getContractAt("LendingPool", CONTRACT);

  console.log("Funding pool with 1 CELO...");
  const tx = await pool.fundPool({ value: ethers.parseEther("1.0") });
  await tx.wait();

  console.log("Done! Tx hash:", tx.hash);
  console.log("View on Celoscan: https://celoscan.io/tx/" + tx.hash);
}

main().catch(console.error);

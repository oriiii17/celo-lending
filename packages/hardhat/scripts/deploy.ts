import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

// cUSD contract address on each network
const CUSD_ADDRESS: Record<string, string> = {
  alfajores: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  celo: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = (await ethers.provider.getNetwork()).name;

  console.log("Deploying to:", network);
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "CELO");

  const cUSDAddress = network === "celo" ? CUSD_ADDRESS.celo : CUSD_ADDRESS.alfajores;
  console.log("cUSD address:", cUSDAddress);

  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(cUSDAddress);
  await lendingPool.waitForDeployment();

  const address = await lendingPool.getAddress();
  console.log("LendingPool deployed to:", address);

  // Fund the pool with some CELO for liquidity
  if (network !== "celo") {
    const fundTx = await lendingPool.fundPool({ value: ethers.parseEther("0.1") });
    await fundTx.wait();
    console.log("Pool funded with 0.1 CELO");
  }

  // Save deployment info for frontend
  const deploymentInfo = {
    network,
    lendingPool: address,
    cUSD: cUSDAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });
  fs.writeFileSync(
    path.join(deploymentsDir, `${network}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Also copy to frontend
  const frontendDir = path.join(__dirname, "../../react-app/src/lib");
  if (fs.existsSync(frontendDir)) {
    fs.writeFileSync(
      path.join(frontendDir, "deployments.json"),
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("Deployment info copied to frontend");
  }

  console.log("\nDeployment complete!");
  console.log("Contract address:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

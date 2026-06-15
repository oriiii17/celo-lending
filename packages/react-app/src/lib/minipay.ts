// MiniPay detection and provider helpers

export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((window as any).ethereum?.isMiniPay);
}

export function getMiniPayProvider() {
  if (typeof window === "undefined") return null;
  const eth = (window as any).ethereum;
  if (eth?.isMiniPay) return eth;
  return null;
}

export async function getMiniPayAddress(): Promise<string | null> {
  const provider = getMiniPayProvider();
  if (!provider) return null;
  try {
    const accounts: string[] = await provider.request({ method: "eth_requestAccounts" });
    return accounts[0] ?? null;
  } catch {
    return null;
  }
}

export async function switchToCeloAlfajores() {
  const provider = (window as any).ethereum;
  if (!provider) return;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xAEF3" }], // 44787
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xAEF3",
            chainName: "Celo Alfajores Testnet",
            rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
            nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
            blockExplorerUrls: ["https://alfajores.celoscan.io"],
          },
        ],
      });
    }
  }
}

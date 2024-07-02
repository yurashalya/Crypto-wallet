export const getTickers = async (name: string, symbol: string) => {
  try {
    const coinSymbol = symbol.toLowerCase();
    const response = await fetch(
      `https://api.coinpaprika.com/v1/tickers/${coinSymbol}-${name}/historical?start=2023-10-01&interval=1d`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch tickers:", error); // Error log
    throw error; // Re-throw error to handle it in the query
  }
};

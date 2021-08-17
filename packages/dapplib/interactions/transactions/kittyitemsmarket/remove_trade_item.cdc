import KittyItemsMarket from Project.KittyItemsMarket

// Allows a TradeCollection owner to remove a Kitty Item for trade

transaction(itemID: UInt64) {

  let tradeCollection: &KittyItemsMarket.TradeCollection

  prepare(signer: AuthAccount) {
      // Borrows the signer's TradeCollection
      self.tradeCollection = signer.borrow<&KittyItemsMarket.TradeCollection>(from: KittyItemsMarket.MarketTradePath) 
          ?? panic("Could not borrow the signer's TradeCollection")
  }

  execute {
      // Unlist Kitty Items from trade
      self.tradeCollection.unlistTrade(itemID: itemID)

      log("Unlisted Kitty Item for trade")
  }
}

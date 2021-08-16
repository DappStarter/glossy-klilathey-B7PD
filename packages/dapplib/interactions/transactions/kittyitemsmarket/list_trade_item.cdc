import KittyItemsMarket from Project.KittyItemsMarket

// This transaction allows the signer to list a Kitty Item for trade
// from their Kitty Items Collection

transaction(itemID: UInt64, price: UFix64) {

  let tradeCollection: &KittyItemsMarket.TradeCollection

  prepare(signer: AuthAccount) {
      // Borrows the signer's SaleCollection
      self.tradeCollection = signer.borrow<&KittyItemsMarket.TradeCollection>(from: KittyItemsMarket.MarketTradePath) 
          ?? panic("Could not borrow the TradeCollection")
  }

  execute {
      // Lists Packs for sale
      self.tradeCollection.listForTrade(itemID: itemID, price: price)

      log("Listed Kitty Item for trade")
  }
}

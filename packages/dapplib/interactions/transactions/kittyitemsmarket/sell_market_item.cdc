import KittyItemsMarket from Project.KittyItemsMarket

// This transaction allows the signer to list a Kitty Item for sale
// from their Kitty Items Collection

transaction(itemID: UInt64, price: UFix64) {

  let saleCollection: &KittyItemsMarket.SaleCollection
    let tradeCollection: &KittyItemsMarket.TradeCollection

  prepare(signer: AuthAccount) {
      // Borrows the signer's SaleCollection
      self.saleCollection = signer.borrow<&KittyItemsMarket.SaleCollection>(from: KittyItemsMarket.MarketStoragePath) 
          ?? panic("Could not borrow the SaleCollection")

      self.tradeCollection = signer.borrow<&KittyItemsMarket.TradeCollection>(from: KittyItemsMarket.MarketTradePath) 
          ?? panic("Could not borrow the TradeCollection")

  }

  execute {
      // Lists Packs for sale
      self.saleCollection.listForSale(itemID: itemID, price: price, tradeCollection: self.tradeCollection)

      log("Listed Kitty Items for sale")
  }
}

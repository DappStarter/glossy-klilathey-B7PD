import FungibleToken from Flow.FungibleToken
import KittyItems from Project.KittyItems
import Kibble from Project.Kibble
import NonFungibleToken from Flow.NonFungibleToken

pub contract KittyItemsMarket {
    // Event that is emitted when a new NFT is put up for sale
    //
    pub event ForSale(itemID: UInt64, price: UFix64)
    
    // Event that is emitted when a NFT is purchased
    //
    pub event NFTPurchased(itemID: UInt64, price: UFix64)

    // Event that is emitted when a seller withdraws their NFT from the sale
    //
    pub event SaleWithdrawn(itemID: UInt64)
    /*********************** W2Q8  ***********************/
    //Even that is emitted when a seller trades an NFT with another user
    pub event NFTsTraded(itemID: UInt64);
    
    // Event that is emitted when a seller withdraws their NFT from the trade
    //
    pub event TradeWithdrawn(itemID: UInt64)

    // Event that is emitted when a new NFT is put up for trade
    //
    pub event ForTrade(itemID: UInt64)
    

    /*********************** END - W2Q8 Events  ***********************/
    
    // Named Paths
    //
    pub let MarketStoragePath: StoragePath
    pub let MarketTradePath : StoragePath
    pub let MarketPublicPath: PublicPath
    pub let MarketPublicTradePath : PublicPath


    // SalePublic
    // Interface that users will publish for their SaleCollection
    // that only exposes the methods that are supposed to be public
    //
    // The public can purchase a NFT from this SaleCollection, get the
    // price of a NFT, or get all the ids of all the NFT up for sale
    //
    pub resource interface SalePublic {
        pub fun purchase(itemID: UInt64, recipient: &KittyItems.Collection{NonFungibleToken.CollectionPublic}, buyTokens: @FungibleToken.Vault)
        pub fun checkTradeCollection(itemID: UInt64, tradeCollection : &KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}) : Bool
        pub fun idPrice(itemID: UInt64): UFix64?
        pub fun getIDs(): [UInt64]
    }

    // SaleCollection
    //
    // A Collection that acts as a marketplace for NFTs. The owner
    // can list NFTs for sale and take sales down by unlisting it.
    //
    // Other users can also purchase NFTs that are for sale
    // in this SaleCollection, check the price of a sale, or check
    // all the NFTs that are for sale by their ids.
    //
    pub resource SaleCollection: SalePublic {

        // Dictionary that maps the itemID of the NFTs for 
        // sale and the price of that NFT
        pub var forSale: {UInt64: UFix64}

        // The fungible token vault of the owner of this sale.
        // When someone buys a token, this will be used to deposit
        // tokens into the owner's account.
        access(self) let ownerVault: Capability<&Kibble.Vault{FungibleToken.Receiver}>

        // The owner's Kitty Items Collection that we will withdraw from when a user purchases a NFT.
        access(self) let ownerCollection: Capability<&KittyItems.Collection>

        init (_vault: Capability<&Kibble.Vault{FungibleToken.Receiver}>, _collection: Capability<&KittyItems.Collection>) {
            self.forSale = {}
            self.ownerVault = _vault
            self.ownerCollection = _collection
        }

        // unlistSale
        // simply unlists the NFT from the SaleCollection
        // so it is no longer for sale
        //
        pub fun unlistSale(itemID: UInt64) {
            // remove the itemID from the forSale dictionary
            // this does not need to have a panic associated with it
            // because there is no harm in unlisting a NFT that wasn't previously
            // for sale. 
            self.forSale[itemID] = nil

            emit SaleWithdrawn(itemID: itemID)
        }

        // listForSale
        // listForSale lists Kitty Items for sale
        //
        //W2Q8 - added a check if its listed for trade
        pub fun listForSale(itemID: UInt64, price: UFix64, tradeCollection : &KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}) {
            pre {
                !(tradeCollection.getIDs().contains(itemID)):
                    "This NFT is listed for Trade. Cannot list for Sale"
                price > 0.0:
                    "Cannot list a NFT for 0.0"
            }

            var ownedNFTs = self.ownerCollection.borrow()!.getIDs()
            
            if (ownedNFTs.contains(itemID)) {
                // store the price in the price array
                self.forSale[itemID] = price

                emit ForSale(itemID: itemID, price: price)
            }
        }

        pub fun checkTradeCollection(itemID: UInt64, tradeCollection : &KittyItemsMarket.TradeCollection{KittyItemsMarket.TradePublic}) : Bool {
            return tradeCollection.getIDs().contains(itemID);
        }

        // purchase
        // purchase lets a user send tokens to purchase a NFT that is for sale
        //
        pub fun purchase(itemID: UInt64, recipient: &KittyItems.Collection{NonFungibleToken.CollectionPublic}, buyTokens: @FungibleToken.Vault) {
            pre {
                // ensures only Kibble is passed in as a payment
                buyTokens.isInstance(Type<@Kibble.Vault>()):
                    "Only Flow Tokens are supported for purchase."
                self.forSale[itemID] != nil:
                    "No NFT matching this itemID for sale!"
                buyTokens.balance >= (self.forSale[itemID]!):
                    "Not enough tokens to buy the NFT!"
            }

            // get the value out of the optional
            let price = self.forSale[itemID]!

            let vaultRef = self.ownerVault.borrow()
                ?? panic("Could not borrow reference to owner token vault")
            
            // deposit the user's tokens into the owners vault
            vaultRef.deposit(from: <-buyTokens)
            
            // remove the NFT from the owner's NFT Collection
            let token <- self.ownerCollection.borrow()!.withdraw(withdrawID: itemID)

            // deposit the NFT into the buyers NFT Collection
            recipient.deposit(token: <-token)

            // unlist the sale
            self.unlistSale(itemID: itemID)

            emit NFTPurchased(itemID: itemID, price: price)
        }

        // idPrice
        // idPrice returns the price of a specific NFT in the sale
        // if it exists, otherwise nil
        //
        pub fun idPrice(itemID: UInt64): UFix64? {
            return self.forSale[itemID]
        }

        // getIDs
        // getIDs returns an array of all the NFT IDs that are up for sale
        //
        pub fun getIDs(): [UInt64] {
            return self.forSale.keys
        }
    }

        /*********************** W2Q8  ***********************/
        /* TradePublic
        Interface that users will publish for their TradeCollection
        exposes the methods that are supposed to be public
    
        The public can trade their NFT from an NFT from this TradeCollection
        get all the ids of all the NFT listed for trade
        */
        pub resource interface TradePublic{
        pub fun trade(itemID: UInt64, recipient: &KittyItems.Collection{NonFungibleToken.CollectionPublic})
        pub fun getIDs() : [UInt64]
        }


        /* TradeCollection
        
        A Collection that acts as a trading marketplace for NFTs. 
        
        Other users can also trade NFTs that are listed
        TradeCollection:  check all item IDs that are listed for trade

        */
        pub resource TradeCollection : TradePublic {
        
        //itemIDs array for trade
        pub var forTrade : [UInt64]

        // The owner's Kitty Items Collection that we will withdraw from when a user trades an NFT.
        access(self) let ownerCollection: Capability<&KittyItems.Collection>

        init (_collection: Capability<&KittyItems.Collection>) {
            self.forTrade = []
            self.ownerCollection = _collection
        }

        //unlists Trade from the Trade Collection 
        pub fun unlistTrade(itemID: UInt64) {
            var counter : Int = 0;
            for items in self.forTrade {

                if(items == itemID){
                    self.forTrade.remove(at: counter)
                }
                counter = counter + 1
            }

            emit TradeWithdrawn(itemID: itemID)
        } 

        //lists an NFT for trade 
        pub fun listForTrade(itemID: UInt64, saleCollection : &KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}) {
            pre{
                !(saleCollection.getIDs().contains(itemID)):
                    "This NFT is listed for Sale. Cannot list for Trade"
            }
            var ownedNFTs = self.ownerCollection.borrow()!.getIDs()
            
            if (ownedNFTs.contains(itemID)) {
                // store the itemID in the forTrade array
                self.forTrade.append(itemID)

                emit ForTrade(itemID: itemID)
            }
        }
        
        //lets a user send their NFT they are trading to the other trader
        pub fun trade(itemID: UInt64, recipient: &KittyItems.Collection{NonFungibleToken.CollectionPublic}) {
            pre {
                (self.forTrade.contains(itemID)):
                    "No NFT matching this itemID for trade!"
            }

            // remove the NFT from the owner's NFT Collection
            let token <- self.ownerCollection.borrow()!.withdraw(withdrawID: itemID)

            // deposit the NFT into the trader's NFT Collection
            recipient.deposit(token: <-token)

            // unlist the sale
            self.unlistTrade(itemID: itemID)

            emit NFTsTraded(itemID: itemID)
        }

        // getIDs returns an array of all the NFT IDs that are up for trade
        pub fun getIDs(): [UInt64] {
            return self.forTrade
        }

    }

    // createTradeCollection
    // createCollection returns a new TradeCollection resource to the caller
    //
    pub fun createTradeCollection( ownerCollection: Capability<&KittyItems.Collection>): @TradeCollection {
        return <- create TradeCollection(_collection: ownerCollection)
    }

    /*********************** END W2Q8  ***********************/

    // createSaleCollection
    // createCollection returns a new SaleCollection resource to the caller
    //
    pub fun createSaleCollection(ownerVault: Capability<&Kibble.Vault{FungibleToken.Receiver}>, ownerCollection: Capability<&KittyItems.Collection>): @SaleCollection {
        return <- create SaleCollection(_vault: ownerVault, _collection: ownerCollection)
    }

    init() {
        // Set our named paths
        self.MarketStoragePath = /storage/marketSaleCollection
        self.MarketPublicPath = /public/marketSaleCollection
        self.MarketTradePath = /storage/marketTradeCollection
        self.MarketPublicTradePath = /public/marketTradeCollection
    }
}
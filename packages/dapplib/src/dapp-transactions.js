// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/interactions CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static kibble_mint_tokens() {
		return fcl.transaction`
				import FungibleToken from 0xee82856bf20e2aa6
				import Kibble from 0x01cf0e2f2f715450
				
				transaction(recipient: Address, amount: UFix64) {
				    let tokenMinter: &Kibble.Minter
				    let tokenReceiver: &{FungibleToken.Receiver}
				
				    prepare(signer: AuthAccount) {
				        self.tokenMinter = signer.borrow<&Kibble.Minter>(from: Kibble.MinterStoragePath)
				                                ?? panic("Signer is not the token admin")
				
				        self.tokenReceiver = getAccount(recipient).getCapability(Kibble.ReceiverPublicPath)
				                                .borrow<&{FungibleToken.Receiver}>()
				                                ?? panic("Unable to borrow receiver reference")
				    }
				
				    execute {
				        let mintedVault <- self.tokenMinter.mintTokens(amount: amount)
				
				        self.tokenReceiver.deposit(from: <-mintedVault)
				    }
				}
		`;
	}

	static kibble_setup_account() {
		return fcl.transaction`
				import FungibleToken from 0xee82856bf20e2aa6
				import Kibble from 0x01cf0e2f2f715450
				
				// This transaction is a template for a transaction
				// to add a Vault resource to their account
				// so that they can use the Kibble
				
				transaction {
				
				    prepare(signer: AuthAccount) {
				
				        if signer.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath) == nil {
				            // Create a new Kibble Vault and put it in storage
				            signer.save(<-Kibble.createEmptyVault(), to: Kibble.VaultStoragePath)
				
				            // Create a public capability to the Vault that only exposes
				            // the deposit function through the Receiver interface
				            signer.link<&Kibble.Vault{FungibleToken.Receiver}>(
				                Kibble.ReceiverPublicPath,
				                target: Kibble.VaultStoragePath
				            )
				
				            // Create a public capability to the Vault that only exposes
				            // the balance field through the Balance interface
				            signer.link<&Kibble.Vault{FungibleToken.Balance}>(
				                Kibble.BalancePublicPath,
				                target: Kibble.VaultStoragePath
				            )
				        }
				    }
				}
				
		`;
	}

	static kibble_transfer_tokens() {
		return fcl.transaction`
				import FungibleToken from 0xee82856bf20e2aa6
				import Kibble from 0x01cf0e2f2f715450
				
				// This transaction is a template for a transaction that
				// could be used by anyone to send tokens to another account
				// that has been set up to receive tokens.
				//
				// The withdraw amount and the account from getAccount
				// would be the parameters to the transaction
				
				transaction(amount: UFix64, to: Address) {
				
				    // A reference to the signer's stored vault
				    let vaultRef: &Kibble.Vault
				    // A reference to the recipient's Receiver
				    let receiverRef: &{FungibleToken.Receiver}
				
				    prepare(signer: AuthAccount) {
				
				        // Get a reference to the signer's stored vault
				        self.vaultRef = signer.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
							?? panic("Could not borrow reference to the owner's Vault!")
				
				        // Get a reference to the recipient's Receiver
				        self.receiverRef = getAccount(to).getCapability(Kibble.ReceiverPublicPath)
				                            .borrow<&{FungibleToken.Receiver}>()
							                ?? panic("Could not borrow receiver reference to the recipient's Vault")
				    }
				
				    execute {
				        // Withdraw tokens from the signer's stored vault
				        let sentVault <- self.vaultRef.withdraw(amount: amount)
				
				        // Deposit the withdrawn tokens in the recipient's receiver
				        self.receiverRef.deposit(from: <-sentVault)
				    }
				}
		`;
	}

	static kittyitems_mint_kitty_item() {
		return fcl.transaction`
				// TODO: 
				// Add imports here, then do steps 1, 2, and 3.
				
				// This transction uses the NFTMinter resource to mint a new NFT.
				//
				// It must be signed by the account that has the minter resource
				// stored at path 'KittyItems.MinterStoragePath'.
				
				transaction(recipient: Address, typeID: UInt64) {
				    
				    // local variable for storing the minter reference
				    let minter: &KittyItems.NFTMinter
				    // local variable for a reference to the recipient's Kitty Items Collection
				    let receiver: &{NonFungibleToken.CollectionPublic}
				
				    prepare(signer: AuthAccount) {
				
				        // 1) borrow a reference to the NFTMinter resource in the signer's storage
				        
				        // 2) borrow a public reference to the recipient's Kitty Items Collection
				        
				    }
				
				    execute {
				
				        // 3) mint the NFT and deposit it into the recipient's Collection
				        
				    }
				}
		`;
	}

	static kittyitems_setup_account() {
		return fcl.transaction`
				import NonFungibleToken from 0x01cf0e2f2f715450
				import KittyItems from 0x01cf0e2f2f715450
				
				// This transaction configures an account to hold Kitty Items.
				
				transaction {
				    prepare(signer: AuthAccount) {
				        // if the account doesn't already have a collection
				        if signer.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath) == nil {
				
				            // create a new empty collection
				            let collection <- KittyItems.createEmptyCollection()
				            
				            // save it to the account
				            signer.save(<-collection, to: KittyItems.CollectionStoragePath)
				
				            // create a public capability for the collection
				            signer.link<&KittyItems.Collection{NonFungibleToken.CollectionPublic, KittyItems.KittyItemsCollectionPublic}>(KittyItems.CollectionPublicPath, target: KittyItems.CollectionStoragePath)
				        }
				    }
				}
		`;
	}

	static kittyitems_transfer_kitty_item() {
		return fcl.transaction`
				// TODO:
				// Add imports here, then do steps 1, 2, 3, and 4.
				
				// This transaction transfers a Kitty Item from one account to another.
				
				transaction(recipient: Address, withdrawID: UInt64) {
				    // local variable for a reference to the signer's Kitty Items Collection
				    let signerCollectionRef: &KittyItems.Collection
				
				    // local variable for a reference to the receiver's Kitty Items Collection
				    let receiverCollectionRef: &{NonFungibleToken.CollectionPublic}
				
				    prepare(signer: AuthAccount) {
				
				        // 1) borrow a reference to the signer's Kitty Items Collection
				
				        // 2) borrow a public reference to the recipient's Kitty Items Collection
				
				    }
				
				    execute {
				
				        // 3) withdraw the Kitty Item from the signer's Collection
				
				        // 4) deposit the Kitty Item into the recipient's Collection
				       
				    }
				}
		`;
	}

	static kittyitemsmarket_buy_market_item() {
		return fcl.transaction`
				import FungibleToken from 0xee82856bf20e2aa6
				import KittyItemsMarket from 0x01cf0e2f2f715450
				import NonFungibleToken from 0x01cf0e2f2f715450
				import KittyItems from 0x01cf0e2f2f715450
				import Kibble from 0x01cf0e2f2f715450
				
				// This transaction allows the signer to purchase a Kitty Item
				// with id == itemID from the marketCollectionAddress
				
				transaction(itemID: UInt64, marketCollectionAddress: Address) {
				
				    let saleCollection: &KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}
				
				    let signerKibbleVaultRef: &Kibble.Vault
				
				    let buyerKittyItemsCollection: &KittyItems.Collection{NonFungibleToken.CollectionPublic}
				    
				    prepare(signer: AuthAccount) {
				        // Borrows the MarketCollectionAddress' public SaleCollection so we can purchase from it
				        self.saleCollection = getAccount(marketCollectionAddress).getCapability(KittyItemsMarket.MarketPublicPath)
				            .borrow<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>()
				            ?? panic("Could not borrow the SaleCollection")
				
				        // Borrow the signer's Kibble Vault as a reference
				        self.signerKibbleVaultRef = signer.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
				            ?? panic("Could not borrow reference to the owner's Vault!")
				
				        // Borrows the signer's Kitty Items Collection so we can deposit the newly purchased
				        // Kitty Item into it
				        self.buyerKittyItemsCollection = signer.getCapability(KittyItems.CollectionPublicPath)
				            .borrow<&KittyItems.Collection{NonFungibleToken.CollectionPublic}>()
				            ?? panic("Could not borrow from the signer's Kitty Items Collection")
				
				    }
				
				    execute {
				        // Checks the price of the Kitty Item we want to purchase
				        let cost = self.saleCollection.idPrice(itemID: itemID) ?? panic("A Kitty Item with this itemID is not up for sale")
				        // Withdraw the correct amount of tokens from the signer's FlowToken Vault
				        let vault <- self.signerKibbleVaultRef.withdraw(amount: cost)
				
				        // Purchase the Kitty Item
				        self.saleCollection.purchase(itemID: itemID, recipient: self.buyerKittyItemsCollection, buyTokens: <-vault)
				    }
				}
				
		`;
	}

	static kittyitemsmarket_remove_market_item() {
		return fcl.transaction`
				import KittyItemsMarket from 0x01cf0e2f2f715450
				
				// This transaction allows a SaleCollection owner to remove a Kitty Item
				// from sale
				
				transaction(itemID: UInt64) {
				
				  let saleCollection: &KittyItemsMarket.SaleCollection
				
				  prepare(signer: AuthAccount) {
				      // Borrows the signer's SaleCollection
				      self.saleCollection = signer.borrow<&KittyItemsMarket.SaleCollection>(from: KittyItemsMarket.MarketStoragePath) 
				          ?? panic("Could not borrow the signer's SaleCollection")
				  }
				
				  execute {
				      // Unlist Kitty Items from sale
				      self.saleCollection.unlistSale(itemID: itemID)
				
				      log("Unlisted Kitty Item for sale")
				  }
				}
				
		`;
	}

	static kittyitemsmarket_sell_market_item() {
		return fcl.transaction`
				import KittyItemsMarket from 0x01cf0e2f2f715450
				
				// This transaction allows the signer to list a Kitty Item for sale
				// from their Kitty Items Collection
				
				transaction(itemID: UInt64, price: UFix64) {
				
				  let saleCollection: &KittyItemsMarket.SaleCollection
				
				  prepare(signer: AuthAccount) {
				      // Borrows the signer's SaleCollection
				      self.saleCollection = signer.borrow<&KittyItemsMarket.SaleCollection>(from: KittyItemsMarket.MarketStoragePath) 
				          ?? panic("Could not borrow the SaleCollection")
				  }
				
				  execute {
				      // Lists Packs for sale
				      self.saleCollection.listForSale(itemID: itemID, price: price)
				
				      log("Listed Kitty Items for sale")
				  }
				}
				
		`;
	}

	static kittyitemsmarket_setup_account() {
		return fcl.transaction`
				import KittyItemsMarket from 0x01cf0e2f2f715450
				import FungibleToken from 0xee82856bf20e2aa6
				import NonFungibleToken from 0x01cf0e2f2f715450
				import KittyItems from 0x01cf0e2f2f715450
				import Kibble from 0x01cf0e2f2f715450
				
				// This transaction is confusing. But, all it's doing is allowing the signer
				// to setup their account so they can list Kitty Items for sale. This happens in a few steps:
				
				// 1) Get a capability to the signer's Kibble Vault so when a purchase is made
				// on their SaleCollection, the payment goes to this Kibble Vault.
				// 2) Get a (private) capability to the signer's Kitty Items Collection so when
				// a user wants to purchase from this SaleCollection, it takes it out of 
				// this collection.
				// 3) Create a new SaleCollection and expose it to the public
				// so people can purchase from it.
				
				transaction() {
				
				  prepare(signer: AuthAccount) {
				    if signer.borrow<&KittyItemsMarket.SaleCollection>(from: KittyItemsMarket.MarketStoragePath) == nil && signer.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath) != nil {
				      let ownerKibbleVault = signer.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)
				      assert(ownerKibbleVault.borrow() != nil, message: "Missing or mis-typed Kibble Vault")
				
				      /** The reason we do this part is because we cannot do getCapability for something
				      in storage, so because we need a Capability specifically we just put it in a private
				      path and get it from there. By making it private its also only available to us **/
				      signer.link<&KittyItems.Collection>(/private/privateKittyItemsCollection, target: KittyItems.CollectionStoragePath)
				      
				      let ownerKittyItemsCollection = signer.getCapability<&KittyItems.Collection>(/private/privateKittyItemsCollection)
				      assert(ownerKittyItemsCollection.borrow() != nil, message: "Missing or mis-typed Kitty Items Collection")
				
				      
				      // create a new empty collection
				      let saleCollection <- KittyItemsMarket.createSaleCollection(ownerVault: ownerKibbleVault, ownerCollection: ownerKittyItemsCollection)
				            
				      // save it to the account
				      signer.save(<-saleCollection, to: KittyItemsMarket.MarketStoragePath)
				
				      // create a public capability for the collection
				      signer.link<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>(KittyItemsMarket.MarketPublicPath, target: KittyItemsMarket.MarketStoragePath)
				    
				      log("Gave account a sale collection")
				    }
				  }
				}
		`;
	}

}

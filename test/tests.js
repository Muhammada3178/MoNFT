const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MoNFT Contract", function () {
  let MoNFT;
  let moNFT;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    MoNFT = await ethers.getContractFactory("MoNFT");
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy the contract before each test.
    moNFT = await MoNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await moNFT.owner()).to.equal(owner.address);
    });

    it("Initial current supply should be 0", async function () {
      expect(await moNFT.currentSupply()).to.equal(0);
    });

    it("Max supply should be 10000", async function () {
      expect(await moNFT.maxSupply()).to.equal(10000);
    });
  });

  describe("Minting", function () {
    it("Should mint 5 NFTs from the deployer", async function () {
      for (let i = 0; i < 5; i++) {
        const tx = await moNFT.mint({ value: ethers.parseEther("0.1") });
        await tx.wait(); // wait until the transaction is mined
      }
      expect(await moNFT.currentSupply()).to.equal(5);
      const ownerBalance = await moNFT.balanceOf(owner.address);
      expect(ownerBalance).to.equal(5);
    });

    it("Owner of minted tokens should be deployer", async function () {
      await moNFT.mint({ value: ethers.parseEther("0.1") });
      expect(await moNFT.ownerOf(0)).to.equal(owner.address);
    });
  });

  describe("Minting from User1", function () {
    it("Should mint 3 NFTs from User1", async function () {
      for (let i = 0; i < 3; i++) {
        await moNFT.connect(user1).mint({ value: ethers.parseEther("0.1") });
      }
      // Check if the current supply is correctly updated
      expect(await moNFT.currentSupply()).to.equal(3);

      // Check if User1 owns all 3 tokens
      expect(await moNFT.ownerOf(0)).to.equal(user1.address);
      expect(await moNFT.ownerOf(1)).to.equal(user1.address);
      expect(await moNFT.ownerOf(2)).to.equal(user1.address);

      const user1Balance = await moNFT.balanceOf(user1.address);
      expect(user1Balance).to.equal(3);
    });
  });

  describe("Token Transfer", function () {
    it("Should transfer a token from User1 to User2 and confirm ownership", async function () {
      await moNFT.connect(user1).mint({ value: ethers.parseEther("0.1") });

      // Confirm User1 owns the token initially
      expect(await moNFT.ownerOf(0)).to.equal(user1.address);

      // User1 transfers token to User2
      await moNFT.connect(user1).transferFrom(user1.address, user2.address, 0);

      // Confirm User2 is now the owner of the token
      expect(await moNFT.ownerOf(0)).to.equal(user2.address);
    });
  });

  describe("Approval and Transfer", function () {
    it("Should allow Owner to approve User1 for a token and then let User1 transfer it", async function () {
      await moNFT.mint({ value: ethers.parseEther("0.1") });

      // Owner approves User1 to manage token with ID 0
      await moNFT.approve(user1.address, 0);

      // Verify that User1 is approved to manage token ID 0
      expect(await moNFT.getApproved(0)).to.equal(user1.address);

      // User1 transfers the token from the owner to themselves
      await moNFT.connect(user1).transferFrom(owner.address, user1.address, 0);

      // Verify that User1 now owns the token
      expect(await moNFT.ownerOf(0)).to.equal(user1.address);
    });
  });
});

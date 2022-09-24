// CREDIT: https://hyperledger-fabric.readthedocs.io/en/release-2.2/chaincode4ade.html

package main

import (
  "encoding/json"
  "fmt"
  "log"

  "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
   type SmartContract struct {
      contractapi.Contract
    }

// storagespace describes basic details of pvcs
   type Storagespace struct {
      ID             string `json:"ID"`
      Type          string `json:"type"`
      Location          string `json:"location"`
      Capacity           int    `json:"mt"`
      TempRange     string   `json:"temprange"`
      Owner          string `json:"owner"`
      Avail 	bool    `json:"avail"`
      ValidatedStatus	string    `json:"validatedstatus"`
    }


// AddStorage issues a new asset to the world state with given details.
   func (s *SmartContract) AddStorage(ctx contractapi.TransactionContextInterface, id string, storagetype string, location string, capacity int, temprange string, owner string, avail bool) error {
    exists, err := s.AssetExists(ctx, id)
    if err != nil {
      return err
    }
    if exists {
      return fmt.Errorf("following cold storage   %s already created", id)
    }

    asset := Storagespace{
      ID:             id,
	Type	:          storagetype,
      Location:           location,
      Owner:          owner,
Capacity:capacity,
TempRange:temprange,
Avail: avail,
ValidatedStatus:"created" }
    assetJSON, err := json.Marshal(asset)
    if err != nil {
      return err
    }

    return ctx.GetStub().PutState(id, assetJSON)
  }

// ReadAsset returns the asset stored in the world state with given id.
   func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Storagespace, error) {
    assetJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
      return nil, fmt.Errorf("failed to read from world state: %v", err)
    }
    if assetJSON == nil {
      return nil, fmt.Errorf("the asset %s does not exist", id)
    }
    
    var asset Storagespace
    err = json.Unmarshal(assetJSON, &asset)
    if err != nil {
      return nil, err
    }

    return &asset, nil
  }

// UpdateAsset updates an existing asset in the world state with provided parameters.
   func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, id string,validatedstatus string) error {
    exists, err := s.AssetExists(ctx, id)
    if err != nil {
      return err
    }
    if !exists {
      return fmt.Errorf("the Coldstrogare space is  %s does not exist", id)
    }
    assetJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
      return fmt.Errorf("failed to read from world state: %v", err)
    }
    if assetJSON == nil {
      return fmt.Errorf("the asset %s does not exist", id)
    }

	updateAssest:=Storagespace{}
	err=json.Unmarshal(assetJSON,&updateAssest)
if err != nil {
  return err
}
updateAssest.ValidatedStatus=validatedstatus
    assetJSON, err = json.Marshal(updateAssest)
    if err != nil {
      return err
    }

    return ctx.GetStub().PutState(id, assetJSON)
  }

  // DeleteAsset deletes an given asset from the world state.
  func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {
    exists, err := s.AssetExists(ctx, id)
    if err != nil {
      return err
    }
    if !exists {
      return fmt.Errorf("the asset %s does not exist", id)
    }

    return ctx.GetStub().DelState(id)
  }

// AssetExists returns true when asset with given ID exists in world state
   func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
    assetJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
      return false, fmt.Errorf("failed to read from world state: %v", err)
    }

    return assetJSON != nil, nil
  }

  func main() {
    assetChaincode, err := contractapi.NewChaincode(&SmartContract{})
    if err != nil {
      log.Panicf("Error creating asset-transfer-basic chaincode: %v", err)
    }

    if err := assetChaincode.Start(); err != nil {
      log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
    }
  }

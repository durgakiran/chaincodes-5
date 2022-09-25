'use strict'


// SDK Library to asset with writing the logic
const { Contract } = require('fabric-contract-api');



class CoolStori extends Contract  {

    async InitLedger(ctx) {
        const assets = [
            {
                id: CS1,
                info: {}
            }
        ];

        for (const asset of assets) {
            asset.docType = 'cs';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.id, Buffer.from(JSON.stringify(asset)));
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    // async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
    //     const exists = await this.AssetExists(ctx, id);
    //     if (exists) {
    //         throw new Error(`The asset ${id} already exists`);
    //     }

    //     const asset = {
    //         ID: id,
    //         Color: color,
    //         Size: size,
    //         Owner: owner,
    //         AppraisedValue: appraisedValue,
    //     };
    //     //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    //     await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    //     return JSON.stringify(asset);
    // }

    // // ReadAsset returns the asset stored in the world state with given id.
    // async ReadAsset(ctx, id) {
    //     const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    //     if (!assetJSON || assetJSON.length === 0) {
    //         throw new Error(`The asset ${id} does not exist`);
    //     }
    //     return assetJSON.toString();
    // }

    // // UpdateAsset updates an existing asset in the world state with provided parameters.
    // async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
    //     const exists = await this.AssetExists(ctx, id);
    //     if (!exists) {
    //         throw new Error(`The asset ${id} does not exist`);
    //     }

    //     // overwriting original asset with new asset
    //     const updatedAsset = {
    //         ID: id,
    //         Color: color,
    //         Size: size,
    //         Owner: owner,
    //         AppraisedValue: appraisedValue,
    //     };
    //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    //     return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    // }

    // // DeleteAsset deletes an given asset from the world state.
    // async DeleteAsset(ctx, id) {
    //     const exists = await this.AssetExists(ctx, id);
    //     if (!exists) {
    //         throw new Error(`The asset ${id} does not exist`);
    //     }
    //     return ctx.stub.deleteState(id);
    // }

    // // AssetExists returns true when asset with given ID exists in world state.
    // async AssetExists(ctx, id) {
    //     const assetJSON = await ctx.stub.getState(id);
    //     return assetJSON && assetJSON.length > 0;
    // }

    // // TransferAsset updates the owner field of asset with given id in the world state.
    // async TransferAsset(ctx, id, newOwner) {
    //     const assetString = await this.ReadAsset(ctx, id);
    //     const asset = JSON.parse(assetString);
    //     const oldOwner = asset.Owner;
    //     asset.Owner = newOwner;
    //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    //     await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    //     return oldOwner;
    // }

    // // GetAllAssets returns all assets found in the world state.
    // async GetAllAssets(ctx) {
    //     const allResults = [];
    //     // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    //     const iterator = await ctx.stub.getStateByRange('', '');
    //     let result = await iterator.next();
    //     while (!result.done) {
    //         const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.log(err);
    //             record = strValue;
    //         }
    //         allResults.push(record);
    //         result = await iterator.next();
    //     }
    //     return JSON.stringify(allResults);
    // }


    /**
     * we take info and push it to HLF
     */
    async OnboardCS(ctx, csId, csInfo) {
        console.info('creating a new warehouse entry');
        const cs = {
            id: csId,
            info: csInfo,
            type: 'cs'
        };

        await ctx.stub.putState(csId, Buffer.from(JSON.stringify(cs)));
    }

    async GetCSById(ctx, csId) {
        // received data would be in bytes
        const csInfoByte = await ctx.stub.getState(csId);
        if (!csInfoByte) {
            throw new Error(`${csId} does not exist`);
        }
        
        return csInfoByte.toString();
    }

    async FetchAllCS(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('uft-8');
            let record;
            try {
                record = record.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record['type'] == 'cs') {
                allResults.push({ Key: key, Record: record });
            }
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    /**
     * we take info and push it to HLF
     */
     async RegisterUser(ctx, userId, userInfo) {
        const user = {
            id: userId,
            info: userInfo
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
    }

    async QueryAllUsers(ctx) {
        console.info('==========queried for all users==========')
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('uft-8');
            let record;
            try {
                record = record.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async QueryUserById(ctx, userId) {
        console.info('==========queried for user by id==========')
        const userInfoByte = await ctx.stub.getState(userId);
        if (!userInfoByte) {
            throw new Error(`${userId} does not exist`);
        }
        
        return userInfoByte.toString();
    }


    /**
     * 
     */
     async RegisterInsurer(ctx, insuranceOrgId, insOrgInfo) {
        const insuranceOrgInfo = {
            id: insuranceOrgId,
            info: insOrgInfo
        };

        await ctx.stub.putState(insuranceOrgId, Buffer.from(JSON.stringify(insuranceOrgInfo)));
    }


    async RegisterCollateralManager(ctx, cmId, cmInfo) {
        const collateralManagerInfo = {
            id: cmId,
            info: cmInfo
        };

        await ctx.stub.putState(cmId, Buffer.from(JSON.stringify(collateralManagerInfo)));
    }

    async RegisterTralog(ctx, trId, trInfo) {
        const tralogInfo = {
            id: trId,
            info: trInfo
        };

        await ctx.stub.putState(trId, Buffer.from(JSON.stringify(tralogInfo)));
    }


    async RequestForQuotation(ctx, reqId, reqInfo) {
        const requestInfo = {
            id: reqId,
            info: reqInfo
        };

        await ctx.stub.putState(reqId, Buffer.from(JSON.stringify(requestInfo)));
    }


    async QuoteResponseFromCS(ctx, resId, reqId, reqInfo) {
        const responseInfo = {
            id: resId,
            reqId,
            info: reqInfo
        };

        await ctx.stub.putState(resId, Buffer.from(JSON.stringify(responseInfo)));
    }

    async ConfirmProposal(ctx, cnfId, resId, reqId, resInfo) {
        const confirmInfo = {
            id: cnfId,
            resId: resId,
            reqId,
            info: resInfo
        };

        await ctx.stub.putState(cnfId, Buffer.from(JSON.stringify(confirmInfo)));
    }
}

module.exports = CoolStori
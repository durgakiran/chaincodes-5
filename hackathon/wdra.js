'use strict'


// SDK Library to asset with writing the logic
const { Contract } = require('fabric-contract-api');



class CoolStori extends Contract  {
    constructor() {
        super('WDRA');
    }

    /**
     * we take info and push it to HLF
     */
    async onboardCS(ctx, csId, csInfo) {
        console.info('creating a new warehouse entry');
        const cs = {
            id: csId,
            info: csInfo
        };

        await ctx.stub.putState(csId, Buffer.from(JSON.stringify(cs)));
    }

    async getCSById(ctx, csId) {
        // received data would be in bytes
        const csInfoByte = await ctx.stub.getState(csId);
        if (!csInfo) {
            throw new Error(`${csId} does not exist`);
        }
        
        return csInfoByte.toString();
    }

    /**
     * we take info and push it to HLF
     */
     async registerUser(ctx, userId, userInfo) {
        const user = {
            id: userId,
            info: userInfo
        };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
    }

    async queryAllUsers(ctx) {
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

    async queryUserById(ctx, userId) {
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
     async registerInsurer(ctx, insuranceOrgId, insOrgInfo) {
        const insuranceOrgInfo = {
            id: insuranceOrgId,
            info: insOrgInfo
        };

        await ctx.stub.putState(insuranceOrgId, Buffer.from(JSON.stringify(insuranceOrgInfo)));
    }


    async registerCollateralManager(ctx, cmId, cmInfo) {
        const collateralManagerInfo = {
            id: cmId,
            info: cmInfo
        };

        await ctx.stub.putState(cmId, Buffer.from(JSON.stringify(collateralManagerInfo)));
    }

    async registerTralog(ctx, trId, trInfo) {
        const tralogInfo = {
            id: trId,
            info: trInfo
        };

        await ctx.stub.putState(trId, Buffer.from(JSON.stringify(tralogInfo)));
    }


    async requestForQuotation(ctx, reqId, reqInfo) {
        const requestInfo = {
            id: reqId,
            info: reqInfo
        };

        await ctx.stub.putState(reqId, Buffer.from(JSON.stringify(requestInfo)));
    }


    async quoteResponseFromCS(ctx, resId, reqId, reqInfo) {
        const responseInfo = {
            id: resId,
            reqId,
            info: reqInfo
        };

        await ctx.stub.putState(resId, Buffer.from(JSON.stringify(responseInfo)));
    }

    async confirmProposal(ctx, cnfId, resId, reqId, resInfo) {
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
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as firebase from 'firebase-admin'
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./servicekey.json");

if (!firebase.apps.length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}else {
  firebase.app(); // if already initialized, use that one
}


const db = getFirestore();

interface Wallet {
  encryptedPrivateKey?: string,
  publicKey?: string
}

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method == 'POST') {

    const body = JSON.parse(req.body)
    console.log(body)
    // console.log(JSON.parse(body), 1)
    
    if(!body.encryptedPrivateKey || !body.publicKey || !body.userId) {
      res.status(400).send('Send Public & Private Key')
      return
    }
    console.log(2)
  
    const foundRef = db.collection('wallet').doc(body.userId);
    const found = await foundRef.get()

    console.log(found)
    try {
      if(!found.exists) {
        const wallet = await db.collection('wallet').doc(body.userId).set({
          publicKey: body.publicKey,
          privateKey: body.encryptedPrivateKey,
          userId: body.userId
        })
    
        let returnData = {
          title: 'Wallet Saved Successfully✅',
          description: `Your Wallet's Public Address: ${body.publicKey}`,
          status: 200
        }
        
        res.status(200).send(returnData)
        return
      } else {
        let returnData = {
          title: 'Wallet Already Exists🔥',
          description: `Your Wallet's Public Address: ${found._fieldsProto.publicKey.stringValue}`,
          status: 200
        }
        
        res.status(200).send(returnData)
      }
    } catch (e) {
      let returnData = {
        title: 'Wallet Not Saved Successfully❌',
        description: `There was some problem with server`,
        status: 500
      }
      res.status(500).send(returnData)
    }
  }    
}

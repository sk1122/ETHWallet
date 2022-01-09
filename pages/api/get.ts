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

export default async function get(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method == 'POST') {
    const body = JSON.parse(req.body)
    console.log(body)
  
    if(!body.userId) {
      res.status(400).send('Send Public & Private Key')
      return
    }
    
    const foundRef = db.collection('wallet').doc(body.userId);
    const found = await foundRef.get()

    try {
      var returnData = {
        publicKey: found['_fieldsProto']['publickKey']['stringValue'] || found['_fieldsProto']['publicKey']['stringValue'],
        privateKey: found['_fieldsProto']['privateKey']['stringValue'],
        userId: found['_fieldsProto']['userId']['stringValue'] || null
      }
    } catch (e) {
      res.status(400).json({ error: "This User ID doesn't exists" })
      return
    }

    res.status(200).json(returnData)
  }

}

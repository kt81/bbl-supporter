import fs from "fs";
import readline from "readline";
import {google, sheets_v4 as SheetsApi} from "googleapis";
import {OAuth2Client} from "google-auth-library";

const CRED_PATH = "vault/spreadsheet-credentials.json";
const TOKEN_PATH = "vault/token.json";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// Libs
export async function getSheetsObj(): Promise<SheetsApi.Sheets> {
  const cred = JSON.parse(fs.readFileSync(CRED_PATH, "utf8"));
  const client = await authorize(cred);
  return new SheetsApi.Sheets({auth: client});
}

// export async function getArray(
//   sheetsObj: any,
//   spreadsheetId: string,
//   range: string
// ): Promise<any[][]> {
//   return (await new Promise((resolve, reject) => {
//     sheetsObj.spreadsheets.values.get(
//       {spreadsheetId, range},
//       (err: any, res: any) => (err ? reject(err) : resolve(res.data.values))
//     );
//   })) as any[][];
// }

// export async function getObjectArray(
//   sheetsObj: any,
//   spreadsheetId: string,
//   range: string
// ): Promise<any[]> {
//   return toObjectArray(await getArray(sheetsObj, spreadsheetId, range));
// }

// function toObjectArray(array: any[][]): any[] {
//   const header = array.splice(0, 1)[0];
//   const output = [] as any[];
//
//   array.forEach((el) => {
//     const entry = {} as any;
//     header.forEach((h, i) => {
//       entry[h] = el[i] ? el[i] : undefined;
//     });
//     output.push(entry);
//   });
//
//   return output;
// }

async function authorize(cred: any): Promise<OAuth2Client> {
  const {
    client_secret: secret,
    client_id: clientId,
    redirect_uris: redirectUris,
  } = cred.installed;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    secret,
    redirectUris[0]
  );

  try {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } catch (e) {
    return await getNewToken(oAuth2Client);
  }
}

async function getNewToken(oAuth2Client: OAuth2Client): Promise<OAuth2Client> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  global.console.log("Authorize this app by visiting this url: ", authUrl);

  return (await new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        reject(err);
        if (!token) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject();
        }
        oAuth2Client.setCredentials(token!);

        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));

        resolve(oAuth2Client);
      });
    });
  })) as OAuth2Client;
}

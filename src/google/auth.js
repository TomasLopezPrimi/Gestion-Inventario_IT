import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const API_KEY = process.env.REACT_APP_API_KEY
const SHEET_ID = process.env.REACT_APP_SHEET_ID
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;
let gapi = window.gapi
let google = window.google

function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}
/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(setAuth) {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
        toast.success("¡Iniciaste sesión con éxito!")
    setAuth(true)
  };

  //Lo de abajo por ahora no lo estamos usando ya que no estamos dejando que pidan permisos

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }

  // -------------------
}

function handleSignoutClick(setAuth) {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    document.getElementById("authorize_button").remove()
    setAuth(false)
    toast.success("Has cerrado sesión correctamente.\n\n La pagina se recargará a la brevedad")
    setTimeout(() => window.location.reload(), 4000);
  }
}

async function GetContentSheet(hoja) {
  let response;
  try {
        response = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,   
          range: hoja,
        });
      } catch (err) {
        console.error(err)
        return;
      }
      const range = response.result;
      const output = range.values
      return output

    }


    export {GetContentSheet, handleAuthClick, gapiLoaded, handleSignoutClick, initializeGapiClient, gisLoaded}
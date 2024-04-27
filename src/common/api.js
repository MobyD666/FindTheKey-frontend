const apiUrl='/ftk/api';
const apiProfiling=true;

import { start_profile,end_profile } from "./profile.js";

export async function apiCall(path,data)
{
  try 
  {
    //console.log('apicall',apiUrl+path,data);
    start_profile('api'+path);
    const response = await fetch(apiUrl+path, 
        {
            method: 'POST',
            headers: 
            {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const t=end_profile('api'+path);
        if (apiProfiling) console.log('API POST '+path+' took '+t.toFixed(3)+'ms');
    
        // Check if the request was successful
        if (!response.ok) 
        {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    
        // Step 4: Use response.json() method to parse the JSON response from the server
        const jsonResponse = await response.json();
        //console.log('Server response:', jsonResponse);
        return (jsonResponse);
        } catch (error) {
            console.error('Error:', error);
      }
      return (null);
}

export async function saveConfig(configurationToken,config)
{
    if (configurationToken) return (null!=await apiCall('/configsave',{configurationToken:configurationToken,config: {config:config}}));
    return (null);
}


/**
 * Send a message to the Chaster modal to tell it that your configuration page
 * supports the save capability
 */
export function reportCapabilities()
{
window.parent.postMessage(
    JSON.stringify({
      type: "partner_configuration",
      event: "capabilities",
      payload: { features: { save: true } },
    }),
    "*"
 
   );
   //console.log('Capabilities reported');
}

export function enableSaveListener(saveEvent)
{
    // Add an event listener to receive events from Chaster
    addEventListener("message", async (e) => 
    { 
        console.log('on message event',e);
        if (typeof e.data !== "string") return;

        if (e.data=='[iFrameSizer]resize') return;
  
        const { type, event } = JSON.parse(e.data);
  
        if (type === "chaster" && event === "partner_configuration_save") 
        {
            // Show a spinner loader on the modal
            window.parent.postMessage(JSON.stringify({ type: "partner_configuration", event: "save_loading" }),"*");
  
        // Send the configuration to your backend to save it
        if (await saveEvent())
        {
            // Close the modal
            window.parent.postMessage(JSON.stringify({ type: "partner_configuration", event: "save_success" }),"*");
        }
        else
        {
            window.parent.postMessage(JSON.stringify({ type: "partner_configuration", event: "save_failed" }),"*");
        }
        }
        
        
    });
   
}


export async function getBasicInfo(mainToken)
{
        const response = await apiCall('/basicinfo',{mainToken:mainToken});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        console.log('Basic info received',response);
        return(response);
}

export async function getBasicInfoCacheId(mainToken)
{
        const response = await apiCall('/basicinfocacheid',{mainToken:mainToken});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        console.log('Basic info cache id received',response);
        return(response);
}


export async function getKeyCandidates(mainToken)
{
        const response = await apiCall('/keycandidates',{mainToken:mainToken});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendGuessKey(mainToken,keyid)
{
        const response = await apiCall('/guesskey',{mainToken:mainToken,guessKeyId:keyid});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendRestart(mainToken)
{
        const response = await apiCall('/restartgame',{mainToken:mainToken});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendUnblock(mainToken)
{
        const response = await apiCall('/unblock',{mainToken:mainToken});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendChange(mainToken,silent)
{
        const response = await apiCall('/changekey',{mainToken:mainToken,silent:silent});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendAddFakes(mainToken,count,silent=false)
{
        const response = await apiCall('/addfakekeys',{mainToken:mainToken,count:count,silent:silent});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendBlockers(mainToken,blockers)
{
        const response = await apiCall('/setblockers',{mainToken:mainToken,blockers:blockers});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendUnfairs(mainToken,unfairs)
{
        const response = await apiCall('/setunfairs',{mainToken:mainToken,unfairs:unfairs});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}

export async function sendUnfairSettings(mainToken,unfairSettings)
{
        const response = await apiCall('/setunfairsettings',{mainToken:mainToken,unfairsettings:unfairSettings});
        if (response==null) 
        {
            throw new Error('Network response was not ok.');
        }
        return(response);
}




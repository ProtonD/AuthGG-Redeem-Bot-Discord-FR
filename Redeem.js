
const REDEEM = require("discord.js");
const client = new REDEEM.Client();
const get = require('axios');
const mysql = require('mysql');
var req = require("request");



///////////// CONFIG VARIABLES BOT ---> END /////////////////////

const nbr1 = 10 // Nombre de caractere attribué au mot de passe quand [redeem] :)
const prefix = "+"; // CHOIX DU PREFIX :)
const OWNER = "OldModz95#7213"

///////////// CONFIG VARIABLES ---> END /////////////////////



////////////////////// AUTH.GG ---> START //////////////////////////////

var aid = ""; // AID AUTH.GG 
var secret = ""; // SECRETKEY AUTH.GG (Disponible dans le dashboard)
var apikey = ""; // APIKEY AUTH.GG  (Disponible dans les paramètres de ton compte)
const API = ""; // API FREE  (Disponible dans les paramètres de ton application) / (REGLAGE DE L'API AUTH.GG POUR GERER L'APP DEPUIS DISCORD) :)


////////////////////// AUTH.GG ---> END //////////////////////////////

client.on('ready',() => 
{
	console.log(`- ${client.user.tag} prêt a être utilisé ...\n`)
});



client.on('message', async function(message) {
	

		 ////////////////////////////////////
		/// REDEEM Commande (Work 100%) ////
	   ////////////////////////////////////
	   if(message.content.startsWith(prefix + "redeem")) {
		message.delete(message.author);
		// Arguments pour la clé
		let content = message.content.split(" ");
		let args = content.slice(1);
		const redeemkey = args.join(" ");
		if(!redeemkey) 
		{
			return;
		}
		// Verification de la clé par l'api 
		get(`https://developers.auth.gg/LICENSES/?type=fetch&authorization=${API}&license=${redeemkey}`, 
		{
			headers: 
			{
				'Content-Type': "application/json",
			}
		}).then( (res) => 
		{

			try 
			{
				// Si elle n'existe pas 
				if(`${res.data.license}` === "undefined")
				{
					message.channel.send(`\> ${message.author}, La clé **existe pas**  <a:no:858077944455233536>...`)
				}
				// Si elle existe mais déjà utilisé 
				else if (`${res.data.used}` === "true")
				{
					message.channel.send(`\> ${message.author}, La clé est deja **utilisé** <a:no:858077944455233536>...`)
				}
				else 
				{

		// Permet de générer des caractères pour l'affectation du mot de passe ! 
		function makeid(length) 
		{
			var result           = [];
			var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-@=+*/!:.;?';
			var charactersLength = characters.length;
			for ( var i = 0; i < length; i++ ) {
			  result.push(characters.charAt(Math.floor(Math.random() * 
		 charactersLength)));
		   }
		   return result.join('');
		}

		const passwordsuper = (makeid(nbr1)) // Stockage du mdp dans une variable
		
		// déclaration du container 
		var contentain = 
		{
			"type": "register",
			"aid": aid,
			"apikey": apikey, // Vos données
			"secret": secret,
			"username": `${message.author.id}`, // Disdord ID
			"password": passwordsuper, // Password généré 
			"license": redeemkey, // Key reedem
			"email": `${message.author.username}@cequevousvoulez`, // Pas utile pour moi 
			"hwid": makeid(20) // Hwid generé aleatoirement
		}
		
		// Demarrage Info Hwid User Pour verifier si l'utilisateur existe j'ai utilisé ca car plus simple !
		get(`https://developers.auth.gg/HWID/?type=fetch&authorization=${API}&user=${message.author.id}`, {
		headers: 
		{
			'Content-Type': "application/json",
		}
		}).then( (rol) => {
		
		
			try 
			{
  				// Si l'user n'existe pas alors 
				if(`${rol.data.info}`=== "No user found" )

					{
						// On l'enregistre 
						req.post("https://api.auth.gg/v1/", {form: contentain}, function (err, res, body) 
						{

							try
							{
								if(body.includes("result\":\"success"))
								{
								
								//Et la on triche un peu on reset l'hwid qui a été set aléatoirement
								get(`https://developers.auth.gg/HWID/?type=reset&authorization=${API}&user=${message.author.id}`, {
								headers: {
										'Content-Type': "application/json",
										}
								})
								// Ont vérifie si la personne à le role Premium ou non.
								if(message.member.roles.cache.some(r=>["Premium"].includes(r.name)) ) { // Premium = nom du role qu'il faut chercher
									// Si la personne à deja le role premium ont répond
									message.channel.send(`\> Vous avez deja le role Premium `);
								  } else {
									// Si la personne n'a pas le role premium ont répond
									message.member.roles.add("858079768439029791").catch(console.error); // ID du role à ajouter
									message.channel.send(`\> Le role Premium ta étais ajouté`);
								  }
								// Et hop on envoie le message par DM
								
								message.channel.send(`\> ${message.author}, License validé ! **Regarde tes message priver pour avoir t'es information** <a:valider:680729839543910402>`);
								message.author.createDM().then(channel => 
									{
									channel.send(`**_T'es information d'utilisateur :__** \n\n\> Username : \`\`${message.author.id}\`\` \n\> Password : \`\`${passwordsuper}\`\` \n\n Si vous avez une question contacter ${OWNER}!`)
									})
								}

							// Erreur mais vu que toutes les verifications on été faites il n'y en aura pas :)
							else
							{
							var p = JSON.parse(body)["result"];
							
							if(p == "invalid_license")
							{
								console.log(`Erreur ${p}`)
							}
							
							else if(p == "invalid_username") 
							{	
								console.log(`Erreur ${p}`)
							}
							};
							}
							catch(e)
							{
								console.log(e)
							}

						})
						}
						// Donc sinon si l'utilisateur existe 
						  else
						{	
						// On le delete pour en recréer un autres (Seul méthode j'en ai trouver une autre futur maj)
						get(`https://developers.auth.gg/USERS/?type=delete&authorization=${API}&user=${message.author.id}`, {
						headers: 
						{
						'Content-Type': "application/json",
						}
						}).then( (res) => {
						
							try 
								{
										// Meme chose que le premier mais on le refait pour eviter les beugs 
										var contentain1 = 
										{
											"type": "register",
											"aid": aid,
											"apikey": apikey, // Vos données
											"secret": secret,
											"username": `${message.author.id}`, // Disdord ID
											"password": passwordsuper, // Password généré 
											"license": redeemkey, // Key reedem
											"email": `${message.author.username}@cequevousvoulez`, // Pas utile pour moi 
											"hwid": makeid(20) // Hwid generé aleatoirement
										}

						req.post("https://api.auth.gg/v1/", {form: contentain1}, function (err, res, body)
						{
							
						
							try
							{
								if(body.includes("result\":\"success"))
								{
									// Meme chose on reset HWID Set 
										get(`https://developers.auth.gg/HWID/?type=reset&authorization=${API}&user=${message.author.id}`, {
											headers: {
													'Content-Type': "application/json",
													}
											})
							    // Et hop on renvoie le message par DM (Moi j'use une base de donné qui enregistre les infos donc ca les renvoie pas puisque au premier enregistrement on les enregistrer en gros ca réaplique bref !)
								
								// Ont vérifie si la personne à le role Premium ou non.
								if(message.member.roles.cache.some(r=>["Premium"].includes(r.name)) ) { // Premium = nom du role qu'il faut chercher
									// Si la personne à deja le role premium ont répond
									message.channel.send(`\> Vous avez deja le role Premium `);
								  } else {
									// Si la personne n'a pas le role premium ont répond
									message.member.roles.add("858079768439029791").catch(console.error); // ID du role à ajouter
									message.channel.send(`\> Le role Premium ta étais ajouté`);
								  }
								
								// Check if they have one of many roles
								
								message.channel.send(`\> ${message.author}, License validé ! **Regarde tes message priver pour avoir t'es information** <a:valider:680729839543910402>\n `);
								message.author.createDM().then(channel => 
									{
									channel.send(`**__T'es information d'utilisateur :__** \n\n\> Username : \`\`${message.author.id}\`\` \n\> Password : \`\`${passwordsuper}\`\` \n\n Si vous avez une question contacter ${OWNER}!`)
									})
								}
						    // ERREUR NE PAS TOUCHER
							else
							{
							var p = JSON.parse(body)["result"];
							
							if(p == "invalid_license")
							{
							console.log(`Erreur ${p}`)
							}
							
							else if(p == "invalid_username") 
							{	
								console.log(`Erreur ${p}`)
							}
							};
							}
							catch(e)
							{
							console.log(e)
							}
							})
							}
							catch(error)  
							{
								console.log(error)
							}
							})
							};				
							}
							//	Error
							catch(error)  
							{
								console.log(res.data)
							}
							//	Fermeture req post
							})
							}
							}
							//	Error
							catch(error)
							{
							console.log(res.data)
							}	
							// FIN ERREUR 
		})
	}
})

client.login("");

//Coded and Created By ToooM#0001
//Add role Premium coded By OldModz95#7213
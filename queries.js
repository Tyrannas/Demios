//fonction simple, permet d'ajouter un mot à la database
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:Lesbubulles24@localhost:7474');


module.exports =
{
	findNode: function(contains)
	{
		var tRetourne = [];
		db.cypher(
		{
			query: "MATCH (n:mot) WHERE n.label =~ {label} RETURN n.label;",
			params:
			{
				label: '(?i).*'+contains+'.*',
			},
		},

		function (err, results)
		{
			if(err) throw err;
			for(i = 0; i<results.length;i++)
	    	{
			    if (!results[i])
			    {
			        console.log('Mot inexistant dans la base');
			    }
			    else
			    {
			    	//console.log(results[i]['n.label']);
			    	tRetourne.push(results[i]['n.label']);
			    	//console.log(tRetourne[i]);
			    }
	    	}
	    	tRetourne.forEach(function(mot)
	    	{
	    		console.log(mot);
	    	});
	    	return tRetourne;
		});
	},
	addNode : function(mot)
	 {
		db.cypher(
		{
		    query: 'MERGE (m:mot {label:{label}}) RETURN m',
		    params:
		    {
		        label: mot,
		    },
		}, function (err, results)
		{
		    if (err) throw err;
		});
	},
	addRelation : function(mot1,mot2,force)
	{
		db.cypher(
		{
		    query: "MERGE (mot1:mot {label:{label1}}) MERGE (mot2:mot {label:{label2}}) MERGE (mot1)-[:FAIT_PENSER_A {degre:{force}}]->(mot2);",
		    params: {
		        label1: mot1,
		        label2: mot2,
		        force: force,
		    },
		}, function (err, results)
		{
		    if (err) throw err;
		    console.log(results);
		});
	},
	devNode : function(mot)
	{
		var tMots = [];
		db.cypher(
		{
		    query: "MATCH (m:mot {label:{label}}) MATCH (m:mot)-[r:FAIT_PENSER_A]-(n:mot) RETURN r,n;",
		    params: {
		        label: mot,
		    },
		}, function (err, results)
		{
		    if (err) throw err;
		    for(i = 0; i<results.length;i++)
		    {
			    if (!results[i])
			    {
			        console.log('Mot inexistant dans la base');
			    }
			    else
			    {
			    	var oMot = {};
			        var sMot2 = results[i]['n']['properties']['label'];
			        var sRelation = results[i]['r']['properties']['degre'];
			        oMot.mot = sMot2;
			        oMot.relation = sRelation;
			        tMots.push(oMot);
			        console.log(mot + " fait penser à " + sMot2 + " relation sémantique " + sRelation + "\n");
			    }
		    }
		    return tMots;
		});
	}

}
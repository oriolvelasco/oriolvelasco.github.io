var doblesJunts;
var notesenVeus;
var esborrable;
var partitura;
var llargadaVeu;
var lligadures = [];
var x;

var tempo = 60;
var factor = tempo/60;


var duradaFigures = [];
duradaFigures[0] = {"figura": "rodona", "durada": factor*4, "signe": "1"};
duradaFigures[1] = {"figura": "blancapp", "durada": factor*3.5, "signe": "2dd"};
duradaFigures[2] = {"figura": "blancap", "durada": factor*3, "signe": "2d"};
//duradaFigures[3] = {"figura": "blanca_corx", "durada": factor*2.5};
duradaFigures[3] = {"figura": "blanca", "durada": factor*2, "signe": "2"};
duradaFigures[4] = {"figura": "negrapp", "durada": factor*1.75, "signe": "4dd"};
duradaFigures[5] = {"figura": "negrap", "durada": factor*1.5, "signe": "4d"};
//duradaFigures[7] = {"figura": "negra_semi", "durada": factor*1.25};
duradaFigures[6] = {"figura": "negra", "durada": factor, "signe": "4"};
duradaFigures[7] = {"figura": "corxerap", "durada": factor*0.75, "signe": "8d"};
duradaFigures[8] = {"figura": "corxera", "durada": factor*0.5, "signe": "8"};
duradaFigures[9] = {"figura": "semicorxera", "durada": factor*0.25, "signe": "16"};


function escriuPartitura() 
{
	notesenVeus = [];
	doblesJunts = [];
	partitura = [];
 	var canvas = $("#partitura")[0];
 	var context = $("#partitura").get()[0].getContext("2d");
 	context.clearRect(0, 0, canvas.width, canvas.height);
	var renderer = new Vex.Flow.Renderer(canvas,
		Vex.Flow.Renderer.Backends.CANVAS);

	var ctx = renderer.getContext();
	var stave = new Vex.Flow.Stave(10, 0, 1000);
	stave.addClef("treble").setContext(ctx).draw();

	var octava, nota;
	esborrable = melodiaArreglada.map(function(e){
		if(e.nota.length==2)
		{
			octava = e.nota.slice(1, 2);
			nota = e.nota.slice(0, 1);
		}

		else
		{
			octava = e.nota.slice(2, 3);
			nota = e.nota.slice(0, 2);
		}

		var ubec = {"nota":nota + "/" + octava, "inici": e.inici, "durada": e.durada};

		return ubec;
	});
	console.log(esborrable);
	
	for (var i = 0; i < esborrable.length; i++) 
	{
		var key = [];
		key.push(esborrable[i].nota);
		if(i==esborrable.length-1)
		{
			var a = new NotaArreglada(key, esborrable[i].inici, esborrable[i].durada);
			doblesJunts.push(a);
		}
		else
		{
			for (var j = i+1; j < esborrable.length; j++) 
			{
				if(Math.abs(esborrable[j].inici-esborrable[i].inici)<4 && Math.abs(esborrable[j].durada-esborrable[i].durada)<5)
				{
					key.push(esborrable[j].nota);
					esborrable.splice(j, 1);
				}	
			}
			var a = new NotaArreglada(key, esborrable[i].inici, esborrable[i].durada);
			doblesJunts.push(a);		
		}
	}
	
	console.log(doblesJunts);
	for (var i = 0; i < doblesJunts.length; i++) 
	{
		if(i==0)
		{
			var d = new NotaArreglada(doblesJunts[i].retornaNota(), doblesJunts[i].retornaInici(), doblesJunts[i].retornaDurada(), "nota");
			notesenVeus[0] = [];
			notesenVeus[0].push(d);
		}

		else
		{
			var added = false;
			for (var j = 0; j < notesenVeus.length; j++) 
			{
				if(doblesJunts[i].inici >= notesenVeus[j][notesenVeus[j].length-1].retornaFinal())
				{
					var g = new NotaArreglada(doblesJunts[i].retornaNota(), doblesJunts[i].retornaInici(), doblesJunts[i].retornaDurada(), "nota");
					notesenVeus[j].push(g);
					added = true;
				}
			}

			if(!added)
			{
				var llarg = notesenVeus.length;
				notesenVeus[llarg] = [];
				var f = new NotaArreglada(doblesJunts[i].retornaNota(), doblesJunts[i].retornaInici(), doblesJunts[i].retornaDurada(), "nota");
				notesenVeus[llarg].push(f);
			}
			
		}
	}
	


	var llargadaSilenci;
	for (var i = 0; i < notesenVeus.length; i++) 
	{
		llargadaSilenci = notesenVeus[i][0].retornaInici()-notesenVeus[0][0].retornaInici();
		if(llargadaSilenci!=0)
		{
			var h = new NotaArreglada(notesenVeus[i][0].nota[0], notesenVeus[0][0].retornaInici(), llargadaSilenci, "silenci");
			notesenVeus[i].splice(0, 0, h);
		}

		for (var j = 1; j < notesenVeus[i].length; j++) 
		{
			if(notesenVeus[i][j-1].retornaTipus()!="silenci")
			{
				llargadaSilenci = notesenVeus[i][j].retornaInici()-notesenVeus[i][j-1].retornaFinal();
				if(llargadaSilenci!=0 && donaNegres(llargadaSilenci)!=0.25)
				{
					console.log(donaNegres(llargadaSilenci));
					var m = new NotaArreglada(notesenVeus[i][j].nota[0], notesenVeus[i][j-1].retornaFinal(), llargadaSilenci, "silenci");
					notesenVeus[i].splice(j, 0, m);
				}
			}
		};
	};

	console.log(notesenVeus);

	llargadaVeu = [];
	var veuFormat;
	for (var i = 0; i < notesenVeus.length; i++) 
	{
		llargadaVeu[i] = 0;
		veuFormat = [];
		for (var j = 0; j < notesenVeus[i].length; j++) 
		{
			//buscar la nota i si és silenci
			var temps = notesenVeus[i][j].retornaDurada()/23;
			llargadaVeu[i] += donaNegres(temps);
			var value = retornaFigura(temps);

			if (notesenVeus[i][j].retornaTipus()=="silenci") 
			{
				value+="r";
				var x = new Vex.Flow.StaveNote({keys: [notesenVeus[i][j].nota], duration: value});
			}

			else
				var x = new Vex.Flow.StaveNote({keys: notesenVeus[i][j].nota, duration: value});
			
			//afegir sostinguts a les notes
			for (var k = 0; k < notesenVeus[i][j].nota.length; k++) 
			{
				if(notesenVeus[i][j].nota[k].length==4)
					x.addAccidental(k,  new Vex.Flow.Accidental("#"));
			}

			//afegir punts a les notes
			var valorPunt;
			if (notesenVeus[i][j].retornaTipus()=="silenci") 
				valorPunt = 3;
			else
				valorPunt = 2;

			if(donaNegres(temps)!=factor*0.25 || value.slice(0,2) != "16")
			{
				if(value.length==valorPunt)
					x.addDotToAll();

				if(value.length==valorPunt+1)
					x.addDotToAll().addDotToAll();
			}

			veuFormat.push(x);
		}
		partitura.push(veuFormat);
	}

	//trobar la llargada en semicorx de cada veu
	var llargadaVeuRodo = llargadaVeu.map(function(e){
		return e*4;
	});

	var max = 0;
	var llVeu;
	for (var i = 0; i < llargadaVeuRodo.length; i++) 
	{
		llVeu = llargadaVeuRodo[i];
		console.log(llVeu);
		if(llVeu>max)
			max=llVeu;
	}

	for (var i = 0; i < partitura.length; i++) 
	{
		for (var j = 0; j < Math.abs(llargadaVeuRodo[i]-max); j++) 
		{
			var x = new Vex.Flow.StaveNote({keys: ["A/4"], duration: "16r"});
			partitura[i].push(x);
			llargadaVeuRodo[i]++;
		};
		
	};
	
	console.log(partitura);
	console.log(llargadaVeuRodo);

	//crear totes les veus
	var voice = [];
	for (var i = 0; i < partitura.length; i++) 
	{
		var veu = new Vex.Flow.Voice({
			num_beats: llargadaVeuRodo[i],
			beat_value: 16,
			resolution: Vex.Flow.RESOLUTION
		});
		veu.addTickables(partitura[i]);
		voice.push(veu);
	}

	// Format and justify the notes to 1000 pixels
	var formatter = new Vex.Flow.Formatter().
		joinVoices(voice).format(voice, 1000);

	//dibuixar veus
	for (var i = 0; i < voice.length; i++) 
	{
		voice[i].draw(ctx, stave);
	}

	partitura=[];
	voice = [];
	doblesJunts = [];
	esborrable = [];
}


function donaNegres(temps)
{
	var resta=200;
	var resultat;
	for (var i = 0; i < duradaFigures.length; i++) 
	{
		if(Math.abs(temps-duradaFigures[i].durada)<resta)
		{
			resta=Math.abs(temps-duradaFigures[i].durada);
			resultat = duradaFigures[i].durada/factor;
		}
			
	}
	return resultat;
}

function retornaFigura(temps)
{
	var resultat;
	var resta=10;
	for (var i = 0; i < duradaFigures.length; i++) {
		if(Math.abs(duradaFigures[i].durada-temps)<resta)
		{
			resta=Math.abs(duradaFigures[i].durada-temps);
			resultat = duradaFigures[i].signe;
		}
	}
	return resultat;
}

function escriuResultat()
{
	document.getElementById('resultat').innerHTML = "";
	var text = "";
	text += "<br><table><tr><th>Nota</th><th>Inici</th><th>Durada</th></tr>";

    for (var j = 0; j < melodiaArreglada.length; j++)
    {
        text+= "<tr>";
        text+= "<td>" + melodiaArreglada[j].nota + "</td>";
        text+= "<td>" + melodiaArreglada[j].inici + "</td>";
        text+= "<td>" + melodiaArreglada[j].durada + "</td>";
        text+="</tr>";
    }

    text+="</table>";

    document.getElementById('resultat').innerHTML = text;
}
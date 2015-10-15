window.capture_audio = function(event) 
{
    var nyquist = context.sampleRate/2;

    // get the average for the first channel
    intensitats =  new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(intensitats);

    //buscar la mitjana
    var total = intensitats.reduce(function(a, b) {return a + b;});
    mitjana = total / intensitats.length + 78;
    var pics = [];
    pics.push(mitjana);
    pics.push(totalPics(intensitats));
    //buscar tots els pics
    for (var i = 0; i < intensitats.length; i++) {
        if(isPeak(i))
        {
            var p = new pic(intensitats[i], i);
            pics.push(p);
        } 
    };

    //actualitzar espectre
    ctx.clearRect(0, 0, 2000, 325);
    ctx.fillStyle=gradient;
    drawSpectrum(intensitats);

    temps.push(pics);
    t++;
}

function isPeak(index)
{
    var c = true;
    if(intensitats[index]<mitjana)
    {
        return false;
    }

    if(index<5)
    {
        for (var i = 1; i < index; i++) {
            if(intensitats[index]>intensitats[index-i])
            {
                //continue;
            }
            else
            {
                c=false;
            }
        };

        for (var i = 1; i < 5; i++) {
            if(intensitats[index]>intensitats[index+i])
            {
                //continue;
            }
            else
            {
                c=false;
            }
        };
    }

    else if(index>intensitats.length-6)
    {
        for (var i = 1; i < intensitats.length-index; i++) {
            if(intensitats[index]>intensitats[index+i])
            {
                //continue;
            }
            else
            {
                c=false;
            }
        };

        for (var i = 1; i < 5; i++) {
            if(intensitats[index]>intensitats[index-i])
            {
                //continue;
            }
            else
            {
                c=false;
            }
        };
    }

    else
    {
        for (var i = 1; i < 5; i++) {
            if(intensitats[index]>intensitats[index-i] && intensitats[index]>intensitats[index+i])
            {
                //continue;
            }
            else
            {
                c=false;
            }
        };
    }

    return c;
}

function totalPics(intensitats)
{
    var total=0;
    var c = true;
    for (var i = 5; i < intensitats.length-6; i++) {
        for (var j = 1; j < 5; j++) {
            if(intensitats[i]>intensitats[i-j] && intensitats[i]>intensitats[i+j]) {}
            else
            {
                c=false;
                break;
            }
        };

        if(c)
            total++;
        else
            c=true;
    };
    return total;
}

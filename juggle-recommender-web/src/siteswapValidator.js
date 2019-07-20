if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf=function(val/*,from*/)
    {
      var b=this.length;

      var a=Number(arguments[1]) || 0;
      if(a<0)
        a=0;

      for(;a<b;a++)
        {
          if(a in this && this[a]===val)
            return a;
        }
      return -1;
    };
}

var Hex='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var SynchChars='(,)';
var Feedback;
var Type


function getDifficulty(siteswap,Period){
  //Example Alg for ss441
  //D1 = 2 + √ ( ((4-2)squared + (4-2)squared + (1-2)squared)÷3 ) 
  //first step is is ((4-2)squared + (4-2)squared + (1-2)squared)
  //at the end we divide by the period
  let difficulty = 0
  for (var i = 0; i < siteswap.length; i++) {
    let thisChar = siteswap.charAt(i)
    if(thisChar === 'a'){thisChar = 10}
    if(thisChar === 'b'){thisChar = 11}
    if(thisChar === 'c'){thisChar = 12}
    if(thisChar === 'd'){thisChar = 13}
    if(thisChar === 'e'){thisChar = 14}
    if(thisChar === 'f'){thisChar = 15}
    if(thisChar === 'g'){thisChar = 16}
    if(thisChar === 'h'){thisChar = 17}
    if(thisChar === 'i'){thisChar = 18}
    if(thisChar === 'j'){thisChar = 19}
    if(thisChar === 'k'){thisChar = 20}
    if(thisChar === 'l'){thisChar = 21}      
    if (!isNaN(parseInt(thisChar, 10))) {//check to see if this char is a digit
      const thisNumber = parseInt(thisChar, 10)
      difficulty += Math.pow((thisNumber - 2), 2)
    }
  }
  difficulty = difficulty / Period
  difficulty = Math.sqrt(difficulty)
  difficulty = difficulty + 2
  return (difficulty)
}


//function Validate()
export default function Validate(toValidate)//TJ
{


  //var FullCode=document.form.Code.value.toUpperCase();
  var FullCode=toValidate.toUpperCase();

  
  FullCode=FullCode.replace(/\s/g,""); // remove all spaces

  if(FullCode=='') // nothing entered
    return ('invalid');

// if pattern contains parentheses it should be synchronous
  var Synch=FullCode.search(/\(|\)/)!=-1;

// Check syntax

  if(FullCode.match(/^[0-9A-Z]+$/))
    Type='Vanilla';
  else if(FullCode.match(/^([0-9A-Z]*(\[[1-9A-Z]{2,}\])+[0-9A-Z]*)+$/))
    Type='Multiplex';
  else if(FullCode.match(/^(\([02468ACEGIKMOQSUWY]X?,[02468ACEGIKMOQSUWY]X?\))+\*?$/))
    Type='Synchronous';
  else if(FullCode.match(/^(\(([02468ACEGIKMOQSUWYX]X?|\[[2468ACEGIKMOQSUWYX]{2,}\]),([02468ACEGIKMOQSUWY]X?|\[[2468ACEGIKMOQSUWYX]{2,}\])\))+\*?$/))
    Type='Synchronous multiplex';
  else
    {

      return ('invalid');
    }


// Syntax OK


// If Synch SS ends with * mirror pairs of throws
  if(Synch && FullCode.charAt(FullCode.length-1)=='*')
    {
      FullCode=FullCode.substring(0,FullCode.length-1); // remove *

      var TempStr=FullCode.substring(1,FullCode.length-1);
      TempStr=TempStr.replace(/[\(\)]+/g,","); // replace () with ,
      var Mirror=TempStr.split(',');
      for(var a=0;a<Mirror.length;a=a+2)
        {
          FullCode+='(';
          FullCode+=Mirror[a+1];
          FullCode+=',';
          FullCode+=Mirror[a];
          FullCode+=')';
        }
    }




// Code kindly suggested by Anto 2012-02-08
// repeated siteswap sequences (eg 531531531) returned incorrect prime/symmetry info.
// trim to smallest non repeating sequence to fix.

  // input=FullCode; 
  // var FullCode=input[0]; 
  // var tmp=[]; 
  // for(var i=0;i<input.length;i++)
  //   { 
  //     tmp=input.split(FullCode).filter( function(value){return (value=="")?0:1;}) 
  //     if(tmp.length>=1) 
  //       FullCode+=input[i+1]; 
  //     else 
  //       break; 
  //   } 




// start validation

  var Chars=[];
  var Values=[];
  var Beat=[];
  var Destination=[];

  var a=0;
  var b=FullCode.length;
  var ThisChar;
  var SynchOffset=0;
  var ThisBeat=0;
  var InMultiplex=false;

  while(a<b)
    {
      ThisChar=FullCode.charAt(a);

      if(Synch)
        {
          if(ThisChar=='(' || ThisChar==')')
            SynchOffset=1;
          if(ThisChar==',')
            SynchOffset=-1;
        }
        
      if(ThisChar.match(/^[0-9A-Z]+$/))
        {
          Chars[Chars.length]=ThisChar;
          Beat[Beat.length]=ThisBeat;
          if(Synch && FullCode.charAt(a+1)=='X')
            {
              Values[Values.length]=Hex.indexOf(ThisChar)+SynchOffset;
              Chars[Chars.length-1]+='x';
              a++;
            }
          else
            Values[Values.length]=Hex.indexOf(ThisChar);

          if(InMultiplex==false)
            ThisBeat++;
        }
      else
        {
          if(ThisChar=='[')
            InMultiplex=true;
          if(ThisChar==']')
            {
              InMultiplex=false;
              ThisBeat++;
            }
        }
        
      a++;
    }
    
  var Period=ThisBeat;
  var Total=0;
  
  b=Values.length;
  for(a=0;a<b;a++)
    {
      if(Values[a]==0)
        Destination[a]=Beat[a];
      else
        {
          Destination[a]=(Beat[a]+Values[a])%Period;
          Total=Total+Values[a];
        }
    }

  var In=[];
  var Out=[];

  b=Period;
  for(a=0;a<b;a++)
    {
      In[a]=0;
      Out[a]=0;
    }

  b=Destination.length;
  for(a=0;a<b;a++)
    {
      if(Values[a]!=0)
        {
          In[Destination[a]]++;
          Out[Beat[a]]++;
        }
    }

  if(In.toString()==Out.toString())
    {

      const objects = Total/Period
      const difficulty = getDifficulty(toValidate,Period)
      return [objects, difficulty] //TJ 

    }
  else
    {
      return ('invalid')//TJ

    }
  
// useful debug lines
/*
      Feedback.innerHTML+='<hr />';
      Feedback.innerHTML+='<p>Chars: '+Chars+'</p>';
      Feedback.innerHTML+='<p>Values: '+Values+'</p>';
      Feedback.innerHTML+='<p>Beat: '+Beat+'</p>';
      Feedback.innerHTML+='<p>Dest: '+Destination+'</p>';
      Feedback.innerHTML+='<p>Orbits: '+Orbits+'</p>';
      Feedback.innerHTML+='<p>In: '+In+'</p>';
      Feedback.innerHTML+='<p>Out: '+Out+'</p>';
*/
}

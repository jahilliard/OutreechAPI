var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js";
document.querySelector('head').appendChild(jq);

jq.onload = procede;//DON'T TYPE PARENTHESIS

//i.e. 'procede()' runs instantly and assigns return value to jq.onload
//     'procede' gives it a function to run when it's ready (what you want)

function procede()
{
//jQuery commands are loaded (do your magic)
$.ajax({
	type: "POST",
    url: "/checkOrAddProf/john/john",
    context: document.body,
    success: function(retThat){
      console.log(String(retThat));
    }
});
}
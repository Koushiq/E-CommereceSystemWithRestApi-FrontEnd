$(document).ready(function(){
    $("form").submit(function(e){
         e.preventDefault();
         $("#usernameErr").html('');
         $("#passwordErr").html('');
         let User = {
             username:$("#username").val(),
             password:$("#password").val()
         }
         let res=validate(User);
         //console.log( Object.keys(res).length);
         if(Object.keys(res).length==0)
         {
             $.ajax({
                 url:"http://localhost:3001/api/customers/login",
                 method: 'POST',
                 data:{
                     "Username":User.username,
                     "Password":User.password
                 },
                 success: function(res) {
                    if(res!=undefined)
                    {
                        setCookie(User.username,10);
                        window.location.href = "customer.html";
                        
                    }
                    else
                    {
                        alert('invalid username or password');
                    }
                 }
             });
         }
         else
         {
             $("#usernameErr").html(res.usernameErr);
             $("#passwordErr").html(res.passwordErr);
             console.log("error invalid request");
         }
     });
 });
    
 
 function validate(User)
 {
     let errorLog =  {};
     for (let key in User) {
         
         if(User[key]=="")
         {
             errorLog[key+"Err"]=key+" can not be empty";
         }
 
       }
       return errorLog;
 }
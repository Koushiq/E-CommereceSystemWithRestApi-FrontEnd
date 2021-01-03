let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;

$(document).ready(function(){

    
    $("form").submit(function(e){

        e.preventDefault();
        let g =$("#regform input[type='radio']:checked").val();

        let User = {
            username:$("#username").val(),
            password:$("#password").val(),
            cpassword:$("#cpassword").val(),
            firstname:$("#firstname").val(),
            lastname:$("#lastname").val(),
            gender:g,
            dob:$("#dateofbirth").val(),
            address:$("#address").val(),
            createdAt:date,
        }

        //console.log(User);
        let res=validate(User);
        //console.log(res);
        if(Object.keys(res).length==0 && User.password==User.cpassword)
        {
            

            $.ajax({
                url:"http://localhost:3001/api/customers",
                method: 'POST',
                data:{
                    "Username":User.username,
                    "Password":User.password,
                    "FirstName":User.firstname,
                    "Lastname":User.lastname,
                    "Gender":User.gender,
                    "DOB":User.dob,
                    "Address":User.address,
                    "Balance":0,
                    "CreatedAt":User.createdAt
                },
                success: function(res) {
                   if(res!=undefined)
                   {
                     alert("Account Created");
                   }
                   else
                   {
                        alert("not created")
                   }
                }
            }); 
        }
        else
        {
           //
           let str = "";
           for (let key in User) {
            if(res[key+"Err"]!=undefined)
            {
                str += res[key+"Err"]+"<br>";
            }
            
          }
          $("#errLog").html(str);
           
        }

    });
});


function validate(User)
{
    let errorLog =  {};
    for (let key in User) {
        
        if(User[key]=="" || User[key]==undefined)
        {
            errorLog[key+"Err"]=key+" can not be empty";
        }

      }
      return errorLog;
}
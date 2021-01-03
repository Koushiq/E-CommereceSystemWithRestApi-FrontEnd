let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;

$(document).ready(function(){
    console.log("http://localhost:3001/api/admins/"+getCookie());
    $.ajax({
        url:"http://localhost:3001/api/admins/"+getCookie(),
        method: 'GET',
        success: function(res) {
           if(res!=undefined)
           {
              
              if(res[4]!='1')
              {
                alert('Unauthorized');
                window.location.href = "admin.html";
              }
              else
              {
                $.ajax({
                    url:"http://localhost:3001/api/products/",
                    method:'GET',
                    success:function(res)
                    {
                        let str ='';
                        console.log(res);
                        for(let i=0;i<res.length;i++)
                        {
                            str+="<tr><td>"+res[i].ProductId+"</td><td>"+res[i].ProductName+"</td><td>"+res[i].Quantity+"</td><td>"+res[i].Price+"</td><td>"+res[i].Description+"</td><td>"+res[i].CreatedAt+"</td><td>"+res[i].CategoryId+"</td><td>"+res[i].OfferId+"</td><td><img alt="+"1.jpg"+" class="+"productimage"+" src="+res[i].FilePath+"></td><td><a href="+"products.html?delete="+res[i].ProductId+">Delete</a> | <a href="+"products.html?edit="+res[i].ProductId+">Edit</a></td></tr>";
                        }
                        
                        $("#datatable").append(str);
                    }
                });
                $.ajax({
                    url:"http://localhost:3001/api/categories/",
                    method:'GET',
                    success:function(res)
                    {
                        if(res.length==0)
                        {
                            alert('no categories exits create category first');
                            window.location.href="admin.html";
                        }
                        else
                        {
                            console.log(res);
                            let str = '';
                            for(let i=0;i<res.length;i++)
                            {
                               str+=`<option value="`+res[i].CategoryId+`">`+res[i].CategoryName+`</option>`;
                            }
                            $("#category").append(str);
                        }
                    }
                });
              }
           }
           else
           {
               alert('Unauthorized');
               window.location.href = "admin.html";
           }
        },
        error:function(res)
        {
            alert('Unauthorized');
            window.location.href = "admin.html";
        }
    });

    $("form").submit(function(e){
        e.preventDefault();

        let formdata = new FormData();

        let file = $('#picture')[0];
        formdata.append('file', file.files[0]);
        console.log('xxasasdsa',formdata);

        let picture= $("#picture").val().replace(/C:\\fakepath\\/i, '');
        let extension = picture.split('.');
        console.log(picture);
        console.log(extension[extension.length-1]);
        let product = {
            productName:$("#productName").val(),
            quantity:$("#quantity").val(),
            price:$("#price").val(),
            description:$("#description").val(),
            category:$("#category").val()
        }
        let res = validate(product);
        if(Object.keys(res).length==0)
        {
            if(extension[extension.length-1]=='JPG' || extension[extension.length-1]=='png' || extension[extension.length-1]=='PNG' || extension[extension.length-1]=='jpg')
            {
                //product file upload 
               // console.log(resultData);
                $.ajax({
                    url:"http://localhost:3001/api/fileupload",
                    method:'POST',
                    data: formdata,

                    contentType: false,
    
                    processData: false,
                    success: function (res) {
                        console.log(res);
                             //product data insert
                            $.ajax({
                                url:"http://localhost:3001/api/products/",
                                method:'POST',
                                data:{
                                    "ProductName":product.productName,
                                    "Quantity":product.quantity,
                                    "Price":product.price,
                                    "Description":product.description,
                                    "FilePath":res,
                                    "CreatedAt":date,
                                    "CategoryId":product.category
                                },
                                success:function(resultData)
                                {
                                    alert('Success');
                                },
                                error:function()
                                {
                                    console.log('can not insert');
                                }
                            });
                    },
                    error:function()
                    {
                        console.log('not uploaded');
                    }
    
                });
               
            }
            else
            {
                alert('Invalid File Format');
                window.location.href="products.html";
            }
        }
        else
        {
            let str = "";
            for (let key in product) {
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
        
        if(User[key]=="")
        {
            errorLog[key+"Err"]=key+" can not be empty";
        }

      }
      return errorLog;
}
$(document).ready(function(){
    $.ajax({
        url:"http://localhost:3001/api/products/",
        method:'GET',
        success:function(res)
        {
            let str ='';
            console.log(res);
            for(let i=0;i<res.length;i++)
            {
                str+="<tr><td>"+res[i].ProductId+"</td><td>"+res[i].ProductName+"</td><td>"+res[i].Quantity+"</td><td>"+res[i].Price+"</td><td>"+res[i].Description+"</td><td>"+res[i].CreatedAt+"</td><td>"+res[i].CategoryId+"</td><td>"+res[i].OfferId+"</td><td><img alt="+"1.jpg"+" class="+"productimage"+" src="+res[i].FilePath+"></td><td> <button class="+"cartItemBtn"+" id="+res[i].ProductId+"> Add To Cart</button></td></tr>";
            }
            $("#datatable").append(str);
            $('.cartItemBtn').click(function(){ 
               /* $.ajax({
                  url:"http://localhost:3001/api/products/"+this.id,

               }); */
               console.log(this.id);
               //ajax put 


            });

        }
    });
});
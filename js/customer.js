$(document).ready(function(){

    $.ajax({
        url:"http://localhost:3001/api/orderitems/"+getCookie(),
        method:'GET',
        success:function(res)
        {
            console.log(res);
            //cartContent id
            let str= "";
            for(let i=0;i<res.length;i++)
            {
                str+="<tr><td>"+res[i].Product.ProductName+"</td><td>"+res[i].Quantity+"</td><td>"+res[i].OderItemStatus+"</td><td><button class="+"cartBtn"+" id="+res[i].OrderedItemId+">remove</button>";
            }
            $("#cartContent").append(str);
            $(".cartBtn").click(function(){
               let cartItemId = this.id;
                $.ajax({
                    url:"http://localhost:3001/api/orderitems/"+cartItemId,
                    method:"DELETE",
                    success:function(res)
                    {
                        console.log('deleted perfectly');
                        window.location.href="customer.html";
                    },
                    error:function(){
                        alert('not deleted');
                    }
                });

            });
        },
        error:function()
        {
            alert('can not fetch cart');
        }
    });

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
                let productId = this.id; 
                let username = getCookie();
               $.ajax({
                  url:"http://localhost:3001/api/orderitems/"+username+"/"+productId,
                  method:'GET',
                  success:function(result)
                  {
                    if(result!="dublicate")
                    {
                        $.ajax({
                            url:"http://localhost:3001/api/orderitems",
                            method:'POST',
                            data:{
                                "ProductId":productId,
                                "Quantity":1,
                                "OderItemStatus":"incart",
                                "CustomerId":result,
                            },
                            success:function(res)
                            {
                                //console.log(res);
                                window.location.href="customer.html";
                                
                            },
                            error:function(){
                                console.log('not inserted ');
                            }
                        });
                    }
                    else
                    {
                        console.log('not added ');
                    }
                  },
                  error:function()
                  {
                      alert('already in cart');
                  }
               });
            });
        }
    });
});
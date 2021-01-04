let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;


$(document).ready(function(){
    let cartData=null;
    let currBalance = null;
    let userData = null;
    $.ajax({ // userinfo + balance 
        url:"http://localhost:3001/api/customers/balance/"+getCookie(),
        method:"GET",
        success:function(data)
        {   
            userData=data;
            //console.log('user data',data);
            currBalance=data[0].Balance;
            $("#welcomeMessage").append(", Current Balance : "+currBalance);
        },
        failure:function()
        {
            alert('failed to view user balance');
        }
    });
    $.ajax({ // cart items 
        url:"http://localhost:3001/api/orderitems/"+getCookie(),
        method:'GET',
        success:function(res)
        {
            console.log(res);
            cartData=res;
            //cartContent id
            let str= "";
            for(let i=0;i<res.length;i++)
            {
                str+="<tr><td>"+res[i].Product.ProductName+"</td><td>"+res[i].Quantity+"</td><td>"+res[i].OderItemStatus+"</td><td><button class="+"cartBtn"+" id="+res[i].OrderedItemId+">remove</button>";
            }
            if(res.length>0)
            {
                str+="<tr><td><button id="+"checkOutOrder"+">CheckOut</button></td>";
                let total=0;
                for(let i=0;i<cartData.length;i++)
                {
                    total+=(cartData[i].Product.Price * cartData[i].Quantity);
                }
                str+="<td>Total : "+total+"</td></tr>";
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
            //checkout proceed
            $('#checkOutOrder').click(function(){
                console.log('checkout');
                let totalAmount=0;
                for(let i=0;i<cartData.length;i++)
                {
                    totalAmount+=(cartData[i].Product.Price * cartData[i].Quantity);
                }
                console.log(totalAmount);
                if(totalAmount<=currBalance)
                {
                   // alert('checkout proceed');
                   //update customer balance 
                  let xxx={
                    "Username":userData[0].Username,
                    "Password":userData[0].Password,
                    "FirstName":userData[0].FirstName,
                    "Lastname":userData[0].Lastname,
                    "Gender":userData[0].Gender,
                    "DOB":userData[0].DOB,
                    "Address":userData[0].Address,
                    "Balance":currBalance-totalAmount,
                    "CreatedAt":userData[0].CreatedAt
                };
                console.log(xxx);
                   $.ajax({
                        url:"http://localhost:3001/api/customers/"+userData[0].CustomerId,
                        method:"PUT",
                        data:{
                            "Username":userData[0].Username,
                            "Password":userData[0].Password,
                            "FirstName":userData[0].FirstName,
                            "Lastname":userData[0].Lastname,
                            "Gender":userData[0].Gender,
                            "DOB":userData[0].DOB,
                            "Address":userData[0].Address,
                            "Balance":currBalance-totalAmount,
                            "CreatedAt":userData[0].CreatedAt
                        },
                        success:function(response)
                        {
                            console.log('wallet updated');
                            //if wallet update done then proceed checkout
                            $.ajax({
                                url:"http://localhost:3001/api/orders",
                                method:"POST",
                                data:{
                                    "TotalCost":totalAmount,
                                    "Express":0,
                                    "Status":"To Be Delivered",
                                    "DateOrdered":date,
                                    "CustomerId":userData[0].CustomerId,
                                },
                                success:function(response)
                                {
                                    // update cart here 
                                    $.ajax({
                                        url:"http://localhost:3001/api/orderitems/updatecart/"+userData[0].Username,
                                        method:"PUT",
                                        success:function(serverResponse)
                                        {
                                            //console.log('server says',serverResponse);
                                             alert('Items successfully checked out ');
                                        },
                                        error:function()
                                        {
                                            alert('Not successful ');
                                        }
                                    });

                                    alert('checkout successfully done');
                                    window.location.href="customer.html";
                                },
                                error:function()
                                {
                                    alert('Order not inserted ');
                                }
                            });

                        },
                        failure:function()
                        {
                            console.log('wallet updat failed !');
                        }
                   });
                }
                else
                {
                    alert('Not Enough Balance');
                }
            });
        },
        error:function()
        {
            alert('can not fetch cart');
        }
    });

    $.ajax({ // products
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
                console.log(username+" "+productId);
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
                      
                      console.log(cartData);
                      let index=-1;
                        //search product
                        for(i=0;i<cartData.length;i++)
                        {
                            if(cartData[i].ProductId==productId)
                            {
                                index=i;
                                break;
                            }
                        }
                        if(index!=-1)
                        {
                            $.ajax({
                                url:"http://localhost:3001/api/orderitems/"+cartData[index].OrderedItemId,
                                method:'PUT',
                                data:{
                                    "OrderedItemId":cartData[index].OrderedItemId,
                                    "ProductId":productId,
                                    "Quantity":cartData[index].Quantity+1,
                                    "OderItemStatus":"incart",
                                    "CustomerId":cartData[index].CustomerId
                                },
                                success:function(serverResponse)
                                {
                                    window.location.href="customer.html";
                                },
                                error:function()
                                {
                                    alert('Not Updated');
                                }
                              });
                        }
                        else
                        {
                            alert('unknown error occured');
                        }
                  }
               });
            });
        }
    });
});
let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;

$(document).ready(function(){
   let orderData=null; 
    console.log('here');
    $.ajax({
        url:"http://localhost:3001/api/orders/getall/"+getCookie(),
        method:"GET",
        success:function(data)
        {
            orderData=data;
            console.log(data);
            let deliveredOrders = "";
            let pendingOrders = "";
            let str= ``;
            let product= null;
            for(let i=0;i<data.length;i++)
            {
                if(data[i].Status=="To Be Delivered" || data[i].Status=="On The Way")
                {
                    product=data[i].OrderedItems;
                    console.log(product);
                    pendingOrders+=`<tr> <td> Order infos order id :`+data[i].OrderId+` </td> </tr>`;
                    for(let j=0;j<product.length;j++)
                    {
                        
                        pendingOrders+=`<tr><td>Product Name `+product[j].Product.ProductName+`</td></tr>`;
                        pendingOrders+=`<tr><td>Product Pic</td><td> <img class="productimage" src="`+product[j].Product.FilePath+`"> </td></tr>`;
                        
                    } 
                    pendingOrders+=`<tr><td>Ordered : `+data[i].DateOrdered+`</td></tr>`;
                    if(data[i].DateDelivered!=null)
                    {
                        pendingOrders+=`<tr><td>Expected Delivery : `+data[i].DateDelivered+`</td></tr>`;
                    }
                    if(data[i].Express==0)
                    {
                        pendingOrders+=`<tr><td><button class="expressBtn" id="`+data[i].OrderId+`">Request Express</button></td></tr>`;
                    }
                    else
                    {
                        pendingOrders+='<tr><td>Express Delivery For This Order </td></tr>';
                    }
                    pendingOrders+=`<tr><td>Total Cost : `+data[i].TotalCost+`<div class="horizontalbar"><div></td></tr>`;
                   
                }
                else if(data[i].Status=="Delivered")
                {
                    product=data[i].OrderedItems;
                    console.log(product);
                    deliveredOrders+=`<tr> <td> Order infos  : </td> </tr>`;
                    for(let j=0;j<product.length;j++)
                    {
                        
                        deliveredOrders+=`<tr><td>Product Name `+product[j].Product.ProductName+`</td></tr>`;
                        deliveredOrders+=`<tr><td>Product Pic</td><td> <img class="productimage" src="`+product[j].Product.FilePath+`"> </td></tr>`;
                        deliveredOrders+=`<tr><td>OrderId : `+product[i].OrderId+`</td> </tr>`;
                    } 
                    deliveredOrders+=`<tr><td>Ordered : `+data[i].DateOrdered+`</td></tr>`;
                    deliveredOrders+=`<tr><td>Expected Delivery : `+data[i].DateDelivered+`</td></tr>`;
                    if(data[i].Express==0)
                    {
                        deliveredOrders+='<tr><td>Express Delivery For This Order </td></tr>';
                    }
                    else
                    {
                        deliveredOrders+='<tr><td>No Express Delivery For This Order </td></tr>';
                    }
                    deliveredOrders+=`<tr><td>Total Cost : `+data[i].TotalCost+`</td></tr>`;
                }
               
            }
            $("#pendingOrders").append(pendingOrders);
            $("#deliveredOrders").append(deliveredOrders);
            $(".expressBtn").click(function(){
                $.ajax({
                    url:"http://localhost:3001/api/orders/"+this.id,
                    method:"PUT",
                    data:{
                        "TotalCost":orderData[0].TotalCost,
                        "Express":1,
                        "Status":orderData[0].Status,
                        "DateOrdered":orderData[0].DateOrdered,
                        "CustomerId":orderData[0].CustomerId,
                    },
                    success:function(resultData)
                    {
                        alert('updated Successfully');
                        window.localtion.href="myorder.html";
                    },
                    error:function(){
                        alert('not updated');
                    }
                });
            });
        }
       
    });
});
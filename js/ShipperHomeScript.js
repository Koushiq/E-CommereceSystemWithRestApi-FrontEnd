let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;

$(document).ready(function(){
    console.log("http://localhost:3001/api/shippers/"+getCookie());
    $.ajax({
        url:"http://localhost:3001/api/shippers/"+getCookie(),
        method: 'GET',
        success: function(res) {
           if(res!=undefined)
           {
                var sid = getCookie();
                console.log(sid);
                console.log(res.shipperId);
                if(res.shipperId!=sid)
                {
                    alert('Unauthorized');
                    window.location.href = "ShipperHome.html";
                }
                else
                {
                    var loadOrders=function(){
                        $.ajax({
                            url:"http://localhost:3001/api/orders",
                            method: "GET",
                            complete: function(xmlhttp,status){
                                if(xmlhttp.status==200)
                                {
                                    var data=xmlhttp.responseJSON;
                                    var str='';
                                    var exp='';
                                    for (var i = 0; i < data.length; i++)
                                    {
                                        if(data[i].status=="To Be Delivered")
                                        {
                                            if(data[i].express=='1')
                                            {
                                                exp="Yes"
                                            }
                                            else
                                            {
                                                exp="No"
                                            }
                                            str+="<tr><td>"+data[i].orderId+"</td><td>"+data[i].dateOrdered+"</td><td>"+data[i].status+"</td><td>"+exp+"</td><td>"+data[i].totalCost+"</td><td><a href="+"../view/CustomerDetails.html?id="+data[i].customerId+">Customer Info</a></td><td><button class="+"deliverbtn"+" id="+data[i].orderId+">Deliver This</button></td></tr>";
                                        }
                                    }
                                    $("#orderList tbody").html(str);
                                    changeStatus();
                                }
                                else
                                {
                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                }
                            }
                        });
                    }

                    loadOrders();

                    var changeStatus=function(){
                        $(".deliverbtn").click(function(){
                            var id = this.id;
                            console.log(id);
                            $.ajax({
                                url:"http://localhost:3001/api/orders/"+id,
                                method: "GET",
                                complete:function(xmlhttp,status){
                                    if(xmlhttp.status==200)
                                    {
                                        var order = xmlhttp.responseJSON;
                                        $.ajax({
                                            url:"http://localhost:3001/api/orders/"+id,
                                            method: "PUT",
                                            header:"Content-Type:application/json",
                                            data:{
                                                    "TotalCost":order.totalCost,
                                                    "Express":order.express,
                                                    "Status":"On the Way",
                                                    "DateOrdered":order.dateOrdered,
                                                    "CustomerId":order.customerId,
                                                    "ShipperId":sid
                                            },
                                            complete:function(xmlhttp,status){
                                                if(xmlhttp.status==200)
                                                {
                                                    loadOrders();
                                                    $("#msg").html("Order is On the Way!");
                                                }
                                                else
                                                {
                                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                                }
                                            }
                                        });
                                    }
                                    else
                                    {
                                        $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                    }
                                }
                            });
                        });
                    }

                    var updateTable=function(){
                        var selected = $("#selectList").val();

                        $.ajax({
                            url:"http://localhost:3001/api/orders",
                            method: "GET",
                            complete: function(xmlhttp,status){
                                if(xmlhttp.status==200)
                                {
                                    var data=xmlhttp.responseJSON;
                                    var str='';
                                    var exp='';
                                    for (var i = 0; i < data.length; i++)
                                    {
                                        if(selected=="Orders on the way")
                                        {
                                            if(data[i].status=="On the Way")
                                            {
                                                if(data[i].express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                str+="<tr><td>"+data[i].orderId+"</td><td>"+data[i].dateOrdered+"</td><td>"+data[i].status+"</td><td>"+exp+"</td><td>"+data[i].totalCost+"</td><td><a href="+"../view/CustomerDetails.html?id="+data[i].customerId+">Customer Info</a></td><td>N/A</td></tr>";
                                            }
                                            $("#tableHeader").html("Orders on the way");
                                        }
                                        else if(selected=="Orders Delivered")
                                        {
                                            if(data[i].status=="Delivered")
                                            {
                                                if(data[i].express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                    str+="<tr><td>"+data[i].orderId+"</td><td>"+data[i].dateOrdered+"</td><td>"+data[i].status+"</td><td>"+exp+"</td><td>"+data[i].totalCost+"</td><td><a href="+"../view/CustomerDetails.html?id="+data[i].customerId+">Customer Info</a></td><td>N/A</td></tr>";
                                            }
                                            $("#tableHeader").html("Orders Delivered");
                                        }
                                        else if(selected=="My Deliveries")
                                        {
                                            if(data[i].shipperId==sid && data[i].status=="On the Way")
                                            {
                                                if(data[i].express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                str+="<tr><td>"+data[i].orderId+"</td><td>"+data[i].dateOrdered+"</td><td>"+data[i].status+"</td><td>"+exp+"</td><td>"+data[i].totalCost+"</td><td><a href="+"../view/CustomerDetails.html?id="+data[i].customerId+">Customer Info</a></td><td><button class="+"deliverydonebtn"+" id="+data[i].orderId+">Confirm Delivery</button></td></tr>";
                                            }
                                            $("#tableHeader").html("My Deliveries");
                                        }
                                        else if(selected=="Pending Express Orders")
                                        {
                                            if(data[i].status=="To Be Delivered" && data[i].express == '1')
                                            {
                                                if(data[i].express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                str+="<tr><td>"+data[i].orderId+"</td><td>"+data[i].dateOrdered+"</td><td>"+data[i].status+"</td><td>"+exp+"</td><td>"+data[i].totalCost+"</td><td><a href="+"../view/CustomerDetails.html?id="+data[i].customerId+">Customer Info</a></td><td><button class="+"deliverbtn"+" id="+data[i].orderId+">Deliver This</button></td></tr>";
                                            }
                                            $("#tableHeader").html("Pending Express Orders");
                                        }
                                    }

                                    $("#orderList tbody").html(str);
                                    changeStatus();
                                    
                                    $(".deliverydonebtn").click(function(){
                                        var id = this.id;
                                        console.log(id);
                                        $.ajax({
                                            url:"http://localhost:3001/api/orders/"+id,
                                            method: "GET",
                                            complete:function(xmlhttp,status){
                                                if(xmlhttp.status==200)
                                                {
                                                    var order = xmlhttp.responseJSON;
                                                    $.ajax({
                                                        url:"http://localhost:3001/api/orders/"+id,
                                                        method: "PUT",
                                                        header:"Content-Type:application/json",
                                                        data:{
                                                                "TotalCost":order.totalCost,
                                                                "Express":order.express,
                                                                "Status":"Delivered",
                                                                "DateOrdered":order.dateOrdered,
                                                                "DateDelivered":date,
                                                                "CustomerId":order.customerId,
                                                                "ShipperId":order.shipperId
                                                        },
                                                        complete:function(xmlhttp,status){
                                                            if(xmlhttp.status==200)
                                                            {
                                                                loadOrders();
                                                                $("#msg").html("Order has been delivered!");
                                                            }
                                                            else
                                                            {
                                                                $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                                            }
                                                        }
                                                    });
                                                }
                                                else
                                                {
                                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                                }
                                            }
                                        });
                                    });
                                }
                                else
                                {
                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                }
                            }
                        });
                    }

                    $("#selectList").change(function(){
                        var selected = $("#selectList").val();

                        if(selected=="Pending Orders")
                        {
                            loadOrders();
                            $("#tableHeader").html("Pending Orders");
                        }
                        else
                        {
                            updateTable();
                        }
                    });

                    var cleartextboxes=function(){
                        $("#msg").html("");
                    }
                }
           }
           else
           {
               alert('Unauthorized');
               window.location.href = "ShipperHome.html";
           }
        },
        error:function(res)
        {
            alert('Unauthorized');
            window.location.href = "ShipperHome.html";
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
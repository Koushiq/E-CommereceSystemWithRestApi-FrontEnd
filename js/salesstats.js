let currDate = new Date();

$(document).ready(function(){
    let salesData= null;
    let d = new Date(),
    t=d.getDay();
    m = d.getMonth(),
    y = d.getFullYear();
    let month=0;
    let year=0;
    let day=0;
    $.ajax({
        url:"http://localhost:3001/api/orders",
        method:"GET",
        success:function(datas)
        {
            console.log(datas);
            salesData=datas;
            for(let i=0;i<salesData.length;i++)
            {
                let x = new Date(datas[i].DateOrdered);
                if(x.getMonth()==m)
                {
                    month++;
                }
                if(x.getFullYear()==y)
                {
                    year++;
                }
                let isToday = (x.toDateString()==currDate.toDateString());
                console.log(x.toDateString());
                console.log(currDate.toDateString());
                console.log(isToday);
                if(isToday==true)
                {
                    console.log('e');
                    day++;
                }
                
            }
            console.log(day);
            barchart(day,month,year);

        },
        error:function()
        {
            alert('can not see sales');
        }
    })
    let sumCost = 0;
    let sumIncome = 0;
    $.ajax({
        url:"http://localhost:3001/api/walletentry",
        method:"GET",
        success:function(data){ 
            for(let i=0;i<data.length;i++)
            {
                console.log(data[i].Status);
                if(data[i].Status=="Approved")
                {
                    sumCost+=data[i].Amount;
                }
            }
            $.ajax({
                url:"http://localhost:3001/api/orders",
                method:"GET",
                success:function(data)
                {
                    for(let i=0;i<data.length;i++)
                    {
                        sumIncome+=data[i].TotalCost;
                    }
                    
                    donut(sumIncome,sumCost);
                }
            });
        },
        error:function(){
            alert('error');
        }
    });

});

    //chart js 
function barchart(day,month,year)
{
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Today', 'This Month', 'This Year'],
            datasets: [{
                label: 'Number of Sales',
                data: [day, month, year],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
    });
}

function donut(sumIncome,sumCost)
{
    var ctx = document.getElementById('myChart2').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Sales Income', 'Cost'],
            datasets: [{
                data: [sumIncome, sumCost],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        }
    });
}
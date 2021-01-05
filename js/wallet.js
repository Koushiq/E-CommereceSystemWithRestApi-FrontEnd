$(document).ready(function(){
    let walletData = null;
    $.ajax({
        url:"http://localhost:3001/api/WalletEntry",
        method:"GET",
        success:function(data)
        {   
            walletData=data;
            
            for(let i=0;i<data.length;i++)
            {
                var tableRow = `<td>`+data[i].WalletEntryId+`</td><td>`+data[i].CustomerId+`</td><td>`+data[i].Amount+`</td>`;
                var serial = `<td>`+(i+1)+`</td>`;
                var requestedAt = `<td>`+(new Date(data[i].RequestedAt)).toLocaleString()+`</td>`;
                if(data[i].Status == "Pending")
                {
                    var approveBtn = `<td id = "row_`+data[i].WalletEntryId+`"><button class = "btn-success" id="approve_`+data[i].WalletEntryId+`">Approve</button> `;
                    var rejectBtn = `<button class = "btn-danger" id="reject_`+data[i].WalletEntryId+`">Reject</button></td>`;
                    $("#pendingWalletRechargeContents").append("<tr>" + serial + tableRow + requestedAt + approveBtn + rejectBtn + "</tr>");
                    $("#approve_"+data[i].WalletEntryId).click(function() {
                        ApproveWalletRequest(data[i].WalletEntryId);
                    });
                    $("#reject_"+data[i].WalletEntryId).click(function() {
                        RejectWalletRequest(data[i].WalletEntryId);
                    });
                }
                else
                {
                    var reviewedAt = `<td>`+(new Date(data[i].ActionAt)).toLocaleString()+`</td>`;
                    var status = `<td>` + data[i].Status + `</td>`;
                    $("#previousWalletRechargeContents").append("<tr>" + serial + tableRow + status + requestedAt + reviewedAt + "</tr>");
                }
            }
        },
        failure:function()
        {
            alert('failed to view wallet entries');
        }
    });
});

function ApproveWalletRequest(walletEntryId) 
{
    $.ajax({
        url:"http://localhost:3001/api/walletentry/approve/"+walletEntryId,
        method:"GET",
        success:function(data)
        {   
            $("#row_"+walletEntryId).html("Approved");
        },
        failure:function()
        {
            alert('failed to view wallet entries');
        }
    });
}

function RejectWalletRequest(walletEntryId) 
{
    $.ajax({
        url:"http://localhost:3001/api/walletentry/reject/"+walletEntryId,
        method:"GET",
        success:function(data)
        {   
            $("#row_"+walletEntryId).html("Rejected");
        },
        failure:function()
        {
            alert('failed to view wallet entries');
        }
    });
}
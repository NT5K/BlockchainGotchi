let sidebartoggle = false
document.getElementById("layoutSidenav_content").onclick = function() {
    if (sidebartoggle == true)  {
        document.body.classList.toggle('sb-sidenav-toggled');
        sidebartoggle = false
        return
    }
}

window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            sidebartoggle = document.body.classList.contains('sb-sidenav-toggled');
        });
    } else { 
        return
    }
});

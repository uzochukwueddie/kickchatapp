module.exports = {
    //return {
        RandomValue: (num) =>{
            var string = "0123456789";
            var str = '';
            var i = 0;
            while(i < num){
              str += string.charAt(Math.floor(Math.random() * string.length));
              i++;
            }
            return str;
        },
    //}
}
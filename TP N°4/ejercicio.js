const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};
const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);
function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
    });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    const seleccion=formulario['sel'];
    let pat=Pat(seleccion);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=`<!doctype html><html><head></head><body>${pat}</body></html>`;
    respuesta.end(pagina);
    });
    
    
    function Pat(sel){
        let resultado="";
        const pc=Math.round(Math.random()*2);
        let selpc="";
        
        if(sel=='f'){
            sel=0;
        }else if(sel=='w'){
            sel=1;   
        }else{
            sel=2;
        }
        
    if((sel==0)&&(pc==2)){
    	resultado="YOU WIN!<br>";
	}else if((sel==0)&&(pc==1)){
        resultado="YOU LOSE :(<br>";
		}else if((sel==1)&&(pc==0)){
            resultado="YOU WIN!<br>";
            }else if((sel==1)&&(pc==2)){
                 resultado="YOU LOSE :(<br>";    
                 }else if((sel==2)&&(pc==0)){
                    resultado="YOU LOSE :(<br>";
                    }else if((sel==2)&&(pc==1)){
                        resultado="YOU WIN!<br>"; 
                        }else if((sel==pc)){
				            resultado="EMPATE :0<br>";
			            }
        
        
    if(pc==0){
            selpc="PIEDRA";
        }else if(pc==1){
            selpc="PAPEL";   
        }else{
            selpc="TIJERA";
        }
        
        resultado+="El servidor eligio: "+selpc;
            
    return resultado;
        }
    }
console.log('Servidor web iniciado');
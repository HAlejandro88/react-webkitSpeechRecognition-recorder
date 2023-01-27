import { useState } from 'react'
import './App.css'


const App = () => {

    const [transcriteText, setTranscribeText] = useState('')


    let mediaRecorder;
    let recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = true;
    recognition.interimResults = false;
    const recordingTranscription = (event) => {
        event.preventDefault();
        console.log('inicia Transcription')
        recognition.start();
    }
    const stopRecognition = () => {
        recognition.continuous = false;
        recognition.abort()
    }


    recognition.onstart = async () => {
        console.log('inico del Recognition')
    }

    recognition.onresult = (event) => {
        const result = event.results;
        console.log(result)
        setTranscribeText(result[result.length -1][0].transcript)
        console.log(transcriteText)
    }


    recognition.onend = () => {
        console.log('end')
        //mediaRecorder.stop()
        //console.log(mediaRecorder)
        console.log('Speech recognition service disconnected');
    }

    const detenerGrabacion = () => {
        //event.preventDefault()
        //if (!mediaRecorder) return alert("No se está grabando");
        console.log(mediaRecorder, 'mediaRec')
        mediaRecorder.stop();
        mediaRecorder = null;
    };

    const comenzarGrabar = async () => {
        //if (!$listaDeDispositivos.options.length) return alert("No hay dispositivos");
        // No permitir que se grabe doblemente
        if (mediaRecorder) return alert("Ya se está grabando");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.start()

            const fragmentosDeAudio = []

            mediaRecorder.ondataavailable = evento => {
                // Y agregarlos a los fragmentos
                fragmentosDeAudio.push(evento.data);
            };

            mediaRecorder.onstop =  () => {
                // Detener el stream
                stream.getTracks().forEach(track => track.stop());
                // Detener la cuenta regresiva
                //detenerConteo();
                // Convertir los fragmentos a un objeto binario
                const blobAudio = new Blob(fragmentosDeAudio);
                const urlParaDescargar = URL.createObjectURL(blobAudio);

                let a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = urlParaDescargar;
                a.download = `${Date.now().toString()}audio.wav`;
                a.click();
                // Y remover el objeto
                window.URL.revokeObjectURL(urlParaDescargar);
            };
        } catch (e) {
           console.log(e)
        }



    };


    return (
    <div>
        <button onClick={recordingTranscription}>Star</button>
        <button onClick={comenzarGrabar}>Iniciar guardo de audio</button>
        <button onClick={stopRecognition}>Stop</button>
        <button onClick={detenerGrabacion}>Stop save</button>
        <textarea id="texto" cols="30" rows="10" value={transcriteText}></textarea>
    </div>
  )
}

export default App


const TranscribeComponent = () => {

    let mediaRecorder;
    let chunks = [];
    let recognition;
    let audio;

    const startRecording = async () => {
        // Obtener el stream de audio del micrófono
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Crear un MediaRecorder para grabar el audio
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.addEventListener("dataavailable", (event) => {
            chunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
            // Crear un Blob del audio grabado
            const audioBlob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
            // Crear una URL a partir del Blob
            const audioUrl = URL.createObjectURL(audioBlob);
            // Crear un Audio objeto a partir de la URL
            audio = new Audio(audioUrl);
            // Asignar un manejador de evento 'onended' al audio
            audio.onended = startRecognition;
            // Reproducir el audio grabado
            audio.play();
            console.log(mediaRecorder)
        });
    };



    const startRecognition = () => {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.addEventListener("result", (event) => {
            const transcript = event.results[0][0].transcript;
            console.log(transcript);
        });

        recognition.start();
    };

    const stopRecording = () => {
        mediaRecorder.stop();
    };



    return (
        <form>
            <div>
                <button onClick={startRecording}>Start Recording</button>
                <button onClick={startRecognition}>Start Recognition</button>
                <button onClick={startRecording}>Stop Recognition</button>
            </div>
        </form>
    )
}

export default TranscribeComponent
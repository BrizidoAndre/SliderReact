import './App.css';
import './css/bootstrap.min.css';
// importando o bootstrap como javascript
import './js/bootstrap.bundle.min.js';
import {useCallback, useEffect, useRef, useState} from "react";
import Radio from "./components/radio";
import {getRandomIntInclusive} from "./utils/functions";

function App() {
    const [slider, setSlider] = useState(0);
    const [images, setImages] = useState([])

    const interval = useRef(null);

    function handleSlide(direction) {
        setSlider(prevState => {
            let index = (prevState + direction) % images.length;
            return index;
        });
    }

    const [sliderMode, setSliderMode] = useState('manual')

    const handleKeyPress = useCallback((ev) => {
        let key = ev.key;
        if (key === 'ArrowLeft') {
            setSlider(prevState => {
                return prevState <= 0 ? prevState : prevState - 1;
            });
        }
        if (key === 'ArrowRight') {
            setSlider(prevState => {
                return prevState >= images.length - 1 ? prevState : prevState + 1
            });
        }
    }, [images])

    useEffect(() => {
        changeMode()
    }, [sliderMode, images])

    function changeMode() {
        if (images.length <= 0) {
            return null
        }
        if (sliderMode === 'manual') {
            window.addEventListener('keydown', handleKeyPress)
        }
        if (sliderMode !== 'manual') {
            window.removeEventListener('keydown', handleKeyPress);
        }
        if (sliderMode === 'automatic') {
            interval.current = setInterval(() => {
                setSlider(prevState => {
                    if (prevState >= images.length - 1) {
                        return 0;
                    }
                    return prevState + 1
                });
            }, 1000)
        }
        if (sliderMode !== 'automatic') {
            const intervalId = interval.current;
            clearInterval(intervalId);
        }
        if (sliderMode === 'random') {
            interval.current = setInterval(() => {
                let random = getRandomIntInclusive(0, images.length - 1);
                setSlider(random);
            }, 1000)
        }
    }

    function getImages(ev) {
        let files = ev.target.files;
        let keys = Object.keys(files);
        let imagesUrls = [];
        keys.forEach(key => {
            let urlImage = URL.createObjectURL(files[key])
            imagesUrls.push(urlImage);
        })
        setImages(imagesUrls);
    }

    return (<div className="App" style={{height: '900vh'}}>
        <div className="container-slider">
            <div className="wrapper" style={{marginLeft: `-${slider * 100}%`, width: `calc(100% * ${images.length})`}}>
                {images.map((image) => {
                    return <div className={'slider'}>
                        <img src={image} alt=""/>
                    </div>
                })}
            </div>
        </div>
        <div className="container">
            <div className="d-flex">
                <button className={'btn btn-outline-secondary'} onClick={() => handleSlide(-1)}>Prev</button>
                <button className={'btn btn-outline-secondary'} onClick={() => handleSlide(1)}>Next</button>
                <input type="file" multiple={true} className={'input-file'} onChange={getImages}/>
            </div>
        </div>
        <div className="container">
            <Radio defaultChecked={true} label={'Manual'} setValue={() => setSliderMode('manual')}/>
            <Radio label={'Automatic'} setValue={() => setSliderMode('automatic')}/>
            <Radio label={'Random'} setValue={() => setSliderMode('random')}/>
        </div>
    </div>);
}

export default App;

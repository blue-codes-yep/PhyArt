async function fetchData() {
    const seed = Math.floor(Math.random() * 10000);  // Generate a random seed
    const size = 220;  // Define size or make it variable as needed
    const url = `http://127.0.0.1:5000/data?size=${size}&seed=${seed}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function setup() {
    createCanvas(1920, 1080).parent('content');
    colorMode(HSB, 360, 100, 100); 
    document.getElementById('loading').style.display = 'block';

    fetchData().then(data => {
        if (data) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            drawData(data);
        }
    });
}

function drawPolygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawData(data) {
    background(220); // Set background to a neutral color

    const originalMin = -2, originalMax = 2; // Original range of X and Y
    const canvasSize = 1920; // Canvas dimensions

    if (Array.isArray(data.X) && Array.isArray(data.Y) && Array.isArray(data.Z) && data.X.length === data.Y.length && data.X.length === data.Z.length) {
        let zMin = Math.min(...data.Z);
        let zMax = Math.max(...data.Z);

        for (let i = 0; i < data.X.length; i++) {
            let x = map(data.X[i], originalMin, originalMax, 0, canvasSize);
            let y = map(data.Y[i], originalMin, originalMax, 0, canvasSize);
            let z = data.Z[i];

            let hue = map(z, zMin, zMax, 0, 360);
            let saturation = map(z, zMin, zMax, 50, 100);
            let brightness = map(z, zMin, zMax, 50, 100);

            fill(hue, saturation, brightness);
            let radius = map(z, zMin, zMax, 5, 20); // Radius based on Z

            // Choose the number of sides for the polygons
            let sides = 6; 

            drawPolygon(x, y, radius, sides);
        }
    } else {
        console.error("Data arrays are not valid or not of the same length.");
    }
}
import * as THREE from "https://unpkg.com/three@0.160.1/build/three.module.js";

const canvas = document.getElementById("bg-3d");
if (canvas) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.innerWidth < 700;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isSmallScreen,
        powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.1, 6.2);

    // ---- Lighting (Unity-editor style: neutral ambient + one cool key light) ----
    scene.add(new THREE.AmbientLight(0x2a3040, 1.8));

    const keyLight = new THREE.DirectionalLight(0xaec6ff, 1.2);
    keyLight.position.set(3.5, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x4c8dff, 6, 14, 2);
    rimLight.position.set(-3, -0.5, -2.5);
    scene.add(rimLight);

    // ---- Editor-style grid floor ----
    const grid = new THREE.GridHelper(46, 46, 0x3a4562, 0x1c2230);
    grid.position.y = -2.1;
    grid.material.transparent = true;
    grid.material.opacity = 0.55;
    scene.add(grid);

    // ---- Plain cube ----
    function buildCube() {
        const group = new THREE.Group();
        const size = 1.7;

        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x1b2130,
            roughness: 0.5,
            metalness: 0.35,
            flatShading: true,
        });

        const cubeGeo = new THREE.BoxGeometry(size, size, size);
        const cube = new THREE.Mesh(cubeGeo, bodyMat);
        group.add(cube);

        const outline = new THREE.LineSegments(
            new THREE.EdgesGeometry(cubeGeo),
            new THREE.LineBasicMaterial({ color: 0x8ab4ff, transparent: true, opacity: 0.5 })
        );
        group.add(outline);

        group.scale.setScalar(0.85);
        return group;
    }

    const shape = buildCube();
    scene.add(shape);
    shape.rotation.set(0.3, -0.6, 0.15);

    // ---- Resize handling ----
    function onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // ---- Scroll-driven camera path (kept subtle, single continuous move) ----
    if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        });

        tl.to(camera.position, { x: 1.8, y: 0.4, z: 4.6, ease: "none" }, 0)
            .to(shape.rotation, { y: -0.6 + Math.PI * 0.7, x: 0.9, ease: "none" }, 0)
            .to(camera.position, { x: -1.9, y: 1.6, z: 5.4, ease: "none" }, 0.5)
            .to(shape.rotation, { y: -0.6 + Math.PI * 1.4, x: 1.5, ease: "none" }, 0.5)
            .to(camera.position, { x: 0, y: 0.9, z: 6.8, ease: "none" }, 1)
            .to(shape.rotation, { y: -0.6 + Math.PI * 2, x: 2.1, ease: "none" }, 1);
    }

    // ---- Render loop (idle bob + look-at, paused when tab hidden) ----
    const clock = new THREE.Clock();

    function animate() {
        const t = clock.getElapsedTime();
        if (!prefersReducedMotion) {
            shape.position.y = Math.sin(t * 0.6) * 0.12;
        }
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    document.addEventListener("visibilitychange", () => {
        renderer.setAnimationLoop(document.hidden ? null : animate);
    });
}

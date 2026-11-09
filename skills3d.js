/* ========================= */
/* 3D SKILL BALLS            */
/* ========================= */

/*
 * Every skill is a small low-poly ball with its logo stuck on the front.
 * One WebGL canvas covers the screen and draws each ball into its own box
 * on the page, so 20 balls still use a single WebGL context.
 * Balls float and turn slowly; hovering tilts a ball towards the mouse and
 * dragging spins it. Without WebGL the plain logo images stay visible.
 */

(function initSkillBalls() {

    const items = Array.from(document.querySelectorAll(".skill-ball"));

    if (!items.length || !window.THREE || !THREE.DecalGeometry) return;

    const canvas = document.createElement("canvas");
    canvas.className = "skill-balls-canvas";
    canvas.setAttribute("aria-hidden", "true");

    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (e) {
        return;
    }

    document.body.appendChild(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setScissorTest(true);

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const geometry = new THREE.IcosahedronGeometry(1, 1);

    function logoTexture(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const size = 256;
                const c = document.createElement("canvas");
                c.width = c.height = size;
                const ctx = c.getContext("2d");
                const pad = size * 0.12;
                ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);
                const tex = new THREE.CanvasTexture(c);
                tex.anisotropy = 4;
                resolve(tex);
            };
            img.onerror = () => resolve(null);
            img.src = url;
        });
    }

    const balls = items.map((el, i) => {

        const view = el.querySelector(".ball-view");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
        camera.position.z = 3.3;

        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const key = new THREE.DirectionalLight(0xffffff, 0.75);
        key.position.set(0.6, 0.8, 1);
        scene.add(key);
        const rim = new THREE.PointLight(0xa855f7, 0.3, 10);
        rim.position.set(-2, -1.5, 2);
        scene.add(rim);

        const group = new THREE.Group();
        const ball = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
            color: 0xfff8eb,
            roughness: 0.55,
            metalness: 0.05,
            flatShading: true,
            polygonOffset: true,
            polygonOffsetFactor: -5
        }));
        group.add(ball);
        scene.add(group);

        const state = {
            el, view, scene, camera, group, ball,
            phase: i * 0.7,
            rx: 0, ry: 0,           // current rotation
            tx: 0, ty: 0,           // target tilt from hover
            spin: 0, vel: 0,        // free spin from dragging
            hover: false, drag: null
        };

        logoTexture(el.dataset.icon).then(tex => {
            if (!tex) return;
            ball.updateMatrixWorld(true);
            const decal = new THREE.Mesh(
                new THREE.DecalGeometry(ball, new THREE.Vector3(0, 0, 1), new THREE.Euler(0, 0, 0), new THREE.Vector3(1.05, 1.05, 1.05)),
                new THREE.MeshStandardMaterial({
                    map: tex,
                    transparent: true,
                    flatShading: true,
                    polygonOffset: true,
                    polygonOffsetFactor: -10,
                    roughness: 0.6
                })
            );
            group.add(decal);
            el.classList.add("is-3d");
        });

        // hover tilts the ball towards the mouse
        view.addEventListener("pointermove", e => {
            const r = view.getBoundingClientRect();
            state.ty = ((e.clientX - r.left) / r.width - 0.5) * 1.4;
            state.tx = ((e.clientY - r.top) / r.height - 0.5) * 1.2;
            if (state.drag !== null) {
                state.vel = (e.clientX - state.drag) * 0.012;
                state.spin += state.vel;
                state.drag = e.clientX;
            }
        });

        view.addEventListener("pointerenter", () => { state.hover = true; });

        view.addEventListener("pointerleave", () => {
            state.hover = false;
            state.tx = state.ty = 0;
            state.drag = null;
        });

        // drag (or swipe) spins it; it keeps turning a little after release
        view.addEventListener("pointerdown", e => {
            state.drag = e.clientX;
            state.vel = 0;
            view.setPointerCapture(e.pointerId);
        });

        const release = () => { state.drag = null; };
        view.addEventListener("pointerup", release);
        view.addEventListener("pointercancel", release);

        return state;
    });

    function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio())) {
            renderer.setSize(w, h, false);
        }
    }

    const clock = new THREE.Clock();

    function frame() {

        requestAnimationFrame(frame);
        resize();

        const t = clock.getElapsedTime();
        const H = window.innerHeight;
        const W = window.innerWidth;

        renderer.setScissor(0, 0, W, H);
        renderer.clear();

        balls.forEach(b => {

            const r = b.view.getBoundingClientRect();

            if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W || r.width === 0) return;

            // wait for the scroll-reveal before drawing the ball
            if (b.el.classList.contains("reveal") && !b.el.classList.contains("visible")) return;

            // idle spin + gentle float
            if (!calm && !b.hover && b.drag === null) b.spin += 0.006;
            if (b.drag === null) {
                b.spin += b.vel;
                b.vel *= 0.94;
            }

            b.rx += (b.tx - b.rx) * 0.12;
            b.ry += (b.ty - b.ry) * 0.12;
            b.group.rotation.x = b.rx;
            b.group.rotation.y = b.ry + Math.sin(b.spin) * 0.6;
            b.group.position.y = calm ? 0 : Math.sin(t * 1.6 + b.phase) * 0.06;
            b.group.scale.setScalar(b.hover ? 1.08 : 1);

            b.camera.aspect = r.width / r.height;
            b.camera.updateProjectionMatrix();

            const x = r.left;
            const y = H - r.bottom;
            renderer.setViewport(x, y, r.width, r.height);
            renderer.setScissor(x, y, r.width, r.height);
            renderer.render(b.scene, b.camera);
        });
    }

    frame();

})();

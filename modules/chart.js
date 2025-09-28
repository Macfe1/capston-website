//Chart.js interactivo

function initChart() {
    console.log("🔄 Iniciando initChart() interactivo...");

    // ====== VERIFICACIONES DE SEGURIDAD ======
    if (typeof Chart === 'undefined') {
        console.error("❌ Chart.js no está cargado");
        return;
    }

    const canvas = document.getElementById('pepitoChart');
    const saldoEl = document.getElementById('saldo-actual');
    const respuestaEl = document.getElementById('respuesta');

    if (!canvas || !saldoEl || !respuestaEl) {
        console.error("❌ Elementos HTML no encontrados");
        return;
    }

    console.log("✅ Todos los elementos encontrados");

    // ====== 1) Variables globales para el estado ======
    window.chartData = {
        saldoInicial: 120000,
        precioHamburguesa: 25000,
        colchon: 50000,
        gastos: []
    };

    // ====== 2) Función para recalcular todo ======
    function recalcularChart() {
        const data = window.chartData;

        // Generar últimos 7 días
        const hoy = new Date();
        const dias = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(hoy);
            d.setDate(hoy.getDate() - (6 - i));
            return d;
        });

        const labels = dias.map(d =>
            d.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })
        );

        // Calcular saldos día por día
        let saldo = data.saldoInicial;
        const saldos = [];
        const movimientos = [];

        dias.forEach((dia, idx) => {
            // Buscar gastos de este día
            const gastosDia = data.gastos.filter(gasto => {
                const fechaGasto = new Date(gasto.fecha);
                return fechaGasto.toDateString() === dia.toDateString();
            });

            let totalGastosDia = gastosDia.reduce((sum, gasto) => sum + gasto.monto, 0);

            saldo += totalGastosDia; // Los gastos ya vienen negativos
            saldos.push(saldo);

            movimientos.push({
                gastos: gastosDia,
                totalDia: totalGastosDia
            });
        });

        // Actualizar UI
        const saldoActual = saldos[saldos.length - 1];
        saldoEl.textContent = saldoActual.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

        // Evaluar hamburguesa
        const okHamburguesa = (saldoActual - data.precioHamburguesa) >= data.colchon;

        if (okHamburguesa) {
            respuestaEl.textContent = 'Sí, alcanza (manteniendo tu colchón)';
            respuestaEl.className = 'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-green-400 bg-green-400/10';
        } else {
            respuestaEl.textContent = 'No por ahora (cuidas tu colchón)';
            respuestaEl.className = 'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-red-400 bg-red-400/10';
        }

        // Preparar estilos de puntos (resaltar días con gastos)
        const pointRadius = movimientos.map(mov => mov.totalDia < 0 ? 6 : 3);
        const pointBackgroundColor = movimientos.map(mov =>
            mov.totalDia < 0 ? 'rgba(239,68,68,0.9)' : 'rgba(255,255,255,0.9)'
        );
        const pointHoverRadius = movimientos.map(mov => mov.totalDia < 0 ? 8 : 5);

        // Actualizar chart
        window.pepitoChart.data.labels = labels;
        window.pepitoChart.data.datasets[0].data = saldos;
        window.pepitoChart.data.datasets[0].pointRadius = pointRadius;
        window.pepitoChart.data.datasets[0].pointBackgroundColor = pointBackgroundColor;
        window.pepitoChart.data.datasets[0].pointHoverRadius = pointHoverRadius;

        // Actualizar tooltip data
        window.pepitoChart.movimientos = movimientos;

        window.pepitoChart.update();
    }

    // ====== 3) Crear Chart inicial ======
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0.00)');

    const baseConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tu Saldo',
                data: [],
                borderColor: 'rgba(99,102,241,1)',
                backgroundColor: grad,
                fill: true,
                tension: 0.35,
                pointRadius: [],
                pointHoverRadius: [],
                pointBackgroundColor: [],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterBody: (items) => {
                            const idx = items[0].dataIndex;
                            const movimientos = window.pepitoChart.movimientos || [];
                            const mov = movimientos[idx];

                            if (mov && mov.gastos.length > 0) {
                                return mov.gastos.map(gasto =>
                                    `${gasto.concepto}: ${gasto.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`
                                ).join('\n');
                            }
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148,163,184,0.1)' } },
                y: {
                    ticks: {
                        color: '#cbd5e1',
                        callback: (v) => v.toLocaleString('es-CO')
                    },
                    grid: { color: 'rgba(148,163,184,0.1)' }
                }
            }
        }
    };

    window.pepitoChart = new Chart(ctx, baseConfig);
    console.log("✅ Chart creado exitosamente");

    // ====== 4) Calcular inicial ======
    recalcularChart();

    // ====== 5) Funciones globales para los formularios ======
    window.actualizarSaldoInicial = function () {
        const input = document.getElementById('saldo-inicial-input');
        if (input && input.value) {
            window.chartData.saldoInicial = parseFloat(input.value);
            recalcularChart();
        }
    };

    window.actualizarPrecioHamburguesa = function () {
        const input = document.getElementById('precio-hamburguesa-input');
        if (input && input.value) {
            window.chartData.precioHamburguesa = parseFloat(input.value);
            recalcularChart();
        }
    };

    window.actualizarColchon = function () {
        const input = document.getElementById('colchon-input');
        if (input && input.value) {
            window.chartData.colchon = parseFloat(input.value);
            recalcularChart();
        }
    };

    window.agregarGasto = function () {
        const conceptoInput = document.getElementById('concepto-input');
        const montoInput = document.getElementById('monto-input');
        const fechaInput = document.getElementById('fecha-input');

        if (conceptoInput && montoInput && fechaInput) {
            const concepto = conceptoInput.value.trim();
            const monto = parseFloat(montoInput.value);
            const fecha = fechaInput.value;

            if (concepto && !isNaN(monto) && fecha) {
                window.chartData.gastos.push({
                    concepto: concepto,
                    monto: -Math.abs(monto), // Siempre negativo para gastos
                    fecha: fecha
                });

                // Limpiar formulario
                conceptoInput.value = '';
                montoInput.value = '';
                fechaInput.value = '';

                // Recalcular
                recalcularChart();
                actualizarListaGastos();
            }
        }
    };

    window.actualizarListaGastos = function () {
        const lista = document.getElementById('lista-gastos');
        if (lista) {
            lista.innerHTML = window.chartData.gastos.map((gasto, idx) => `
                <div class="flex justify-between items-center p-2 bg-white/5 rounded">
                    <span>${gasto.concepto} (${new Date(gasto.fecha).toLocaleDateString('es-CO')})</span>
                    <div>
                        <span class="text-red-400">${gasto.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                        <button onclick="eliminarGasto(${idx})" class="ml-2 text-red-500 hover:text-red-700">×</button>
                    </div>
                </div>
            `).join('');
        }
    };

    window.eliminarGasto = function (idx) {
        window.chartData.gastos.splice(idx, 1);
        recalcularChart();
        actualizarListaGastos();
    };

    // Inicializar lista
    actualizarListaGastos();
}
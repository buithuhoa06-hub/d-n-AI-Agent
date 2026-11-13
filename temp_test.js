
    let state = {
      scenarios: [],
      catalog: [],
      dossiers: [],
      selectedScenarioId: null,
      rows: [],
      isExcelMode: false,
      excelColumns: [],
      excelRows: [],
      columnMapping: {},
      sheetViewMode: "form",
      cleanedData: null,
      evalResult: null,
      retryCount: 0,
      chatHistory: []
    };

    const fmtMoney = (n) => Number(n || 0).toLocaleString("vi-VN") + " đ";

    function showToast(msg) {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.classList.remove("opacity-0");
      setTimeout(() => t.classList.add("opacity-0"), 2600);
    }

    // Tắt các popup hover xâm lấn để giữ giao diện sạch, gọn, không rối mắt
    function showHoverInspector(el, title, badge, htmlBody, preferRight = false) {}
    function hideHoverInspector() {
      const box = document.getElementById("hoverInspector");
      if (box) box.classList.remove("visible");
    }
    function hoverPreviewNav() {}
    function hoverPreviewKpi() {}
    function hoverPreviewPipe() {}
    function hoverPreviewScenario() {}

    // Quản lý hiển thị Bảng theo định dạng File Excel gốc
    function setSheetViewMode(mode) {
      state.sheetViewMode = mode;
      const isExcel = (mode === "excel" && state.excelColumns && state.excelColumns.length > 0);
      const exView = document.getElementById("excelTableView");
      const formView = document.getElementById("standardFormView");
      if (exView) exView.classList.toggle("hidden", !isExcel);
      if (formView) formView.classList.toggle("hidden", isExcel);
      const btnEx = document.getElementById("btnViewExcel");
      const btnFm = document.getElementById("btnViewForm");
      if (btnEx) {
        btnEx.className = isExcel
          ? "px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold border-0 cursor-pointer"
          : "px-2 py-0.5 rounded-lg bg-white text-stone-700 text-[10px] font-semibold border border-stone-200 cursor-pointer";
      }
      if (btnFm) {
        btnFm.className = !isExcel
          ? "px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold border-0 cursor-pointer"
          : "px-2 py-0.5 rounded-lg bg-white text-stone-700 text-[10px] font-semibold border border-stone-200 cursor-pointer";
      }
    }

    function renderExcelTable() {
      if (!state.excelColumns || !state.excelColumns.length) {
        const exView = document.getElementById("excelTableView");
        const formView = document.getElementById("standardFormView");
        const tog = document.getElementById("excelModeToggle");
        if (exView) exView.classList.add("hidden");
        if (formView) formView.classList.remove("hidden");
        if (tog) tog.classList.add("hidden");
        return;
      }
      const tog = document.getElementById("excelModeToggle");
      if (tog) tog.classList.remove("hidden");
      const thead = document.getElementById("excelThHead");
      const tbody = document.getElementById("excelTbBody");

      thead.innerHTML = `<tr>
        <th class="py-1.5 px-2 text-center w-8">#</th>
        ${state.excelColumns.map(c => {
          let roleBadge = "";
          if (state.columnMapping) {
            if (state.columnMapping.item === c) roleBadge = `<span class="ml-1 text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800">Tên</span>`;
            else if (state.columnMapping.sku === c) roleBadge = `<span class="ml-1 text-[9px] px-1 py-0.2 rounded bg-rose-100 text-rose-800">SKU</span>`;
            else if (state.columnMapping.qty === c) roleBadge = `<span class="ml-1 text-[9px] px-1 py-0.2 rounded bg-sky-100 text-sky-800">SL</span>`;
            else if (state.columnMapping.spec === c) roleBadge = `<span class="ml-1 text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-800">Spec</span>`;
            else if (state.columnMapping.price === c) roleBadge = `<span class="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800">Giá</span>`;
          }
          return `<th class="py-1.5 px-2">${c}${roleBadge}</th>`;
        }).join("")}
        <th class="py-1.5 px-2 text-center w-8">Xóa</th>
      </tr>`;

      tbody.innerHTML = (state.excelRows || []).map((row, rIdx) => `
        <tr class="hover:bg-amber-50/50 transition">
          <td class="py-1 px-1.5 text-center font-bold text-stone-400 text-[10px]">${rIdx + 1}</td>
          ${state.excelColumns.map(c => `
            <td class="py-1 px-1">
              <input class="glass-input !py-0.5 !px-1.5 !text-[11px] !bg-white/95 min-w-[110px]"
                     value="${row[c] !== undefined && row[c] !== null ? String(row[c]).replace(/"/g, '&quot;') : ''}"
                     onchange="updateExcelCell(${rIdx}, '${c.replace(/'/g, "\\'")}', this.value)" />
            </td>
          `).join("")}
          <td class="py-1 px-1.5 text-center">
            <button onclick="removeExcelRow(${rIdx})" class="text-rose-500 hover:text-rose-700 font-bold text-xs bg-transparent border-0 cursor-pointer" title="Xóa dòng">✕</button>
          </td>
        </tr>
      `).join("");
    }

    function updateExcelCell(rIdx, col, val) {
      if (state.excelRows && state.excelRows[rIdx]) {
        state.excelRows[rIdx][col] = val;
      }
    }

    function addExcelRow() {
      if (!state.excelColumns || !state.excelColumns.length) return;
      const newRow = {};
      state.excelColumns.forEach(c => newRow[c] = "");
      state.excelRows.push(newRow);
      renderExcelTable();
    }

    function removeExcelRow(rIdx) {
      if (state.excelRows) {
        state.excelRows.splice(rIdx, 1);
        renderExcelTable();
      }
    }
        showHoverInspector(el, "Bước 5: Xuất Báo cáo / Dashboard", ev ? "Sẵn sàng" : "Chờ Feedback OK", body);
      }
    }

    function hoverPreviewScenario(el, id) {
      const sc = state.scenarios.find(x => x.id === id);
      if (!sc) return;
      const rowsHtml = sc.rows.map(r => `<div>• ${r.item || "(trống)"} | SL: <strong>${r.qty}</strong></div>`).join("");
      showHoverInspector(el, `${sc.code}: ${sc.name}`, sc.client,
        `<div><strong>Hạn:</strong> ${sc.deadline} | <strong>Ngân sách:</strong> ${sc.budget} | <strong>CK:</strong> ${sc.discount}%</div>
         <div><strong>SLA:</strong> ${sc.sla || "(chưa nhập)"}</div>
         <div class="pt-1 border-t border-white/15 mt-1">${rowsHtml}</div>`, true);
    }

    function toggleSidebar() {
      const sb = document.getElementById("glassSidebar");
      sb.classList.toggle("collapsed");
      const ic = document.getElementById("collapseIcon");
      ic.style.transform = sb.classList.contains("collapsed") ? "rotate(180deg)" : "rotate(0deg)";
    }

    function toggleGlassControls() {
      document.getElementById("glassPopover").classList.toggle("hidden");
    }

    function setBlur(val) {
      document.documentElement.style.setProperty("--glass-blur", val + "px");
      document.getElementById("blurVal").textContent = val + "px";
    }

    function setTheme(name) {
      const themes = {
        bronze: "linear-gradient(135deg, #5d412e 0%, #8b6850 38%, #ad8a70 72%, #4e3729 100%)",
        emerald: "linear-gradient(135deg, #134e4a 0%, #0f766e 45%, #2dd4bf 100%)",
        midnight: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)"
      };
      document.body.style.background = themes[name] || themes.bronze;
    }

    function toggleChat() {
      document.getElementById("chatPopup").classList.toggle("closed");
    }

    async function bootstrap() {
      const res = await fetch("/api/bootstrap");
      const data = await res.json();
      state.scenarios = data.scenarios || [];
      state.catalog = data.catalog || [];
      state.dossiers = data.dossiers || [];
      state.inboundRequests = data.inbound_requests || [];
      document.getElementById("opsRemHeader").textContent = data.rem_mandays;

      renderScenarios();
      renderInboundRequests();
      renderCatalog();
      renderHistory();
      if (state.scenarios[0]) selectScenario(state.scenarios[0].id);
      lucide.createIcons();

      // Tự động kiểm tra yêu cầu mới từ Cổng Khách hàng (/khach-hang) mỗi 5 giây
      setInterval(pollInbound, 5000);
    }

    async function pollInbound() {
      try {
        const res = await fetch("/api/inbound-requests");
        const data = await res.json();
        const prevNew = (state.inboundRequests || []).filter(r => r.status === "NEW").length;
        state.inboundRequests = data.requests || [];
        const curNew = state.inboundRequests.filter(r => r.status === "NEW").length;
        renderInboundRequests();
        if (curNew > prevNew) {
          showToast("📩 Có yêu cầu mới từ Cổng Khách hàng!");
        }
      } catch (e) {}
    }

    function renderInboundRequests() {
      const list = state.inboundRequests || [];
      const newCount = list.filter(r => r.status === "NEW").length;
      document.getElementById("inboundBadge").textContent = newCount;
      const box = document.getElementById("inboundList");
      if (!list.length) {
        box.innerHTML = `<div class="p-3 rounded-xl bg-white/60 text-[11px] text-stone-500 text-center">Chưa có yêu cầu nào từ Cổng Khách hàng (/khach-hang) hoặc Google Sheet.</div>`;
        return;
      }
      box.innerHTML = list.map(r => `
        <div onclick="processInboundRequest('${r.request_code}')" class="scenario-box !p-3">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-xs font-extrabold text-stone-800 truncate">${r.client_name}</span>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold ${r.status === 'NEW' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">${r.status === 'NEW' ? 'MỚI' : 'ĐÃ XỬ LÝ'}</span>
          </div>
          <div class="text-[10.5px] text-stone-500">${r.request_code} • ${r.source} • ${r.created_at}</div>
          <div class="text-[11px] font-bold text-rose-600 mt-1">Bấm để nạp &amp; AI phân tích ngay →</div>
        </div>
      `).join("");
    }

    async function processInboundRequest(code) {
      const req = (state.inboundRequests || []).find(r => r.request_code === code);
      if (!req) return;
      state.cleanedData = req.cleaned_data;
      state.retryCount = 0;

      // Đồng bộ hiển thị vào form Sheet để tham chiếu
      const raw = req.raw_sheet || {};
      document.getElementById("shClient").value = req.client_name || "";
      document.getElementById("shDeadline").value = raw.deadline || req.cleaned_data?.deadline_days || "10";
      document.getElementById("shBudget").value = raw.budget || req.cleaned_data?.budget || "0";
      document.getElementById("shDiscount").value = raw.discount || req.cleaned_data?.discount_pct || "0";
      document.getElementById("shSla").value = raw.sla || req.cleaned_data?.sla || "";
      if (raw.rows) {
        state.rows = JSON.parse(JSON.stringify(raw.rows));
        renderSheetRows();
      }

      state.rawPreview = "";
      setPipeNode("pnode-1", "done");
      setPipeNode("pnode-c1", "done");
      setPipeNode("pnode-2", "done");
      setPipeNode("pnode-c2", "done");
      showVerifyCleanScreen();
      await fetch(`/api/inbound-requests/${code}/processed`, { method: "POST" });
      await pollInbound();
    }

    async function syncGoogleSheet() {
      const url = document.getElementById("gsheetUrlInput").value.trim();
      if (!url) {
        showToast("Vui lòng dán link Google Sheet trước!");
        return;
      }
      showToast("🔄 Đang đồng bộ dữ liệu từ Google Sheet...");
      const res = await fetch("/api/sync-google-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheet_url: url })
      });
      const data = await res.json();
      if (!data.ok) {
        showToast("❌ " + data.error);
        return;
      }
      state.inboundRequests = data.requests || [];
      renderInboundRequests();
      showToast(`✅ Đã đồng bộ từ Google Sheet (${data.request_code})!`);
    }

    function renderScenarios() {
      const pills = {
        s1: `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Chuẩn / Trong quyền</span>`,
        s2: `<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">Sai định dạng</span>`,
        s3: `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Chưa sạch data</span>`,
        s4: `<span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">Trưởng phòng duyệt</span>`
      };
      document.getElementById("leftScenariosBox").innerHTML = state.scenarios.map(s => `
        <div id="scbox-${s.id}" onclick="selectScenario('${s.id}')" class="scenario-box ${state.selectedScenarioId === s.id ? 'selected' : ''}">
          <div class="flex items-start justify-between gap-2 mb-1">
            <div class="text-xs font-extrabold text-stone-800">${s.code}: ${s.name}</div>
            ${pills[s.id] || ""}
          </div>
          <div class="text-[11px] text-stone-500 leading-snug">${s.client} — ${s.desc}</div>
        </div>
      `).join("");
    }

    function selectScenario(id) {
      const sc = state.scenarios.find(x => x.id === id);
      if (!sc) return;
      state.selectedScenarioId = id;
      state.isExcelMode = false;
      state.excelColumns = [];
      state.excelRows = [];
      setSheetViewMode("form");
      const tog = document.getElementById("excelModeToggle");
      if (tog) tog.classList.add("hidden");

      document.querySelectorAll(".scenario-box").forEach(el => el.classList.remove("selected"));
      const cur = document.getElementById(`scbox-${id}`);
      if (cur) cur.classList.add("selected");

      document.getElementById("shClient").value = sc.client;
      document.getElementById("shDeadline").value = sc.deadline;
      document.getElementById("shBudget").value = sc.budget;
      document.getElementById("shDiscount").value = sc.discount;
      document.getElementById("shSla").value = sc.sla;
      state.rows = JSON.parse(JSON.stringify(sc.rows));
      renderSheetRows();
    }

    function renderSheetRows() {
      document.getElementById("sheetRowsEditor").innerHTML = state.rows.map((r, i) => `
        <div class="grid grid-cols-12 gap-1.5 items-center bg-white/60 p-1.5 rounded-xl border border-white">
          <input class="glass-input col-span-5 !py-1 !text-[11px]" value="${r.item || ''}" onchange="state.rows[${i}].item=this.value" placeholder="Hạng mục" />
          <input class="glass-input col-span-3 !py-1 !text-[11px]" value="${r.spec || ''}" onchange="state.rows[${i}].spec=this.value" placeholder="Thông số" />
          <input class="glass-input col-span-2 !py-1 !text-[11px]" value="${r.qty || '1'}" onchange="state.rows[${i}].qty=this.value" placeholder="SL" />
          <button onclick="state.rows.splice(${i},1);renderSheetRows()" class="col-span-2 text-rose-500 font-bold text-xs bg-transparent border-0 cursor-pointer">Xóa</button>
        </div>
      `).join("");
    }

    function addSheetRow() {
      state.rows.push({ item: "", spec: "", qty: "1", mandatory: "" });
      renderSheetRows();
    }

    function switchLeftTab(tab) {
      document.getElementById("leftInboundBox").classList.toggle("hidden", tab !== "inbound");
      document.getElementById("leftScenariosBox").classList.toggle("hidden", tab !== "scenarios");
      document.getElementById("leftSheetEditor").classList.toggle("hidden", tab !== "sheet");
      document.getElementById("tabLeftInbound").className = tab === "inbound"
        ? "px-2 py-1 rounded-lg bg-white text-[11px] font-bold text-stone-800 shadow-sm border-0 cursor-pointer inline-flex items-center gap-1"
        : "px-2 py-1 rounded-lg bg-transparent text-[11px] font-semibold text-stone-500 border-0 cursor-pointer inline-flex items-center gap-1";
      document.getElementById("tabLeftScen").className = tab === "scenarios"
        ? "px-2 py-1 rounded-lg bg-white text-[11px] font-bold text-stone-800 shadow-sm border-0 cursor-pointer"
        : "px-2 py-1 rounded-lg bg-transparent text-[11px] font-semibold text-stone-500 border-0 cursor-pointer";
      document.getElementById("tabLeftEdit").className = tab === "sheet"
        ? "px-2 py-1 rounded-lg bg-white text-[11px] font-bold text-stone-800 shadow-sm border-0 cursor-pointer"
        : "px-2 py-1 rounded-lg bg-transparent text-[11px] font-semibold text-stone-500 border-0 cursor-pointer";
    }

    async function uploadSheetFile(input) {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-sheet", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) {
        if (data.is_excel && data.columns && data.columns.length) {
          state.isExcelMode = true;
          state.excelColumns = data.columns;
          state.excelRows = data.raw_rows;
          state.columnMapping = data.column_mapping;
          state.rows = data.rows;
          if (data.client) document.getElementById("shClient").value = data.client;
          if (data.budget && data.budget !== "0") document.getElementById("shBudget").value = data.budget;
          if (data.deadline) document.getElementById("shDeadline").value = data.deadline;
          document.getElementById("excelFileLabel").textContent = `${data.filename} (${data.columns.length} cột • ${data.raw_rows.length} dòng)`;
          renderExcelTable();
          setSheetViewMode("excel");
          switchLeftTab("sheet");
          showToast(`📁 Đã nạp file: ${data.filename} (${data.columns.length} cột)`);
        } else {
          state.isExcelMode = false;
          state.rows = data.rows;
          renderSheetRows();
          setSheetViewMode("form");
          switchLeftTab("sheet");
          showToast("Đã nạp file " + data.filename);
        }
      } else {
        showToast("❌ " + (data.error || "Lỗi đọc file"));
      }
      input.value = "";
    }

    function setPipeNode(id, cls) {
      const el = document.getElementById(id);
      if (el) el.className = "pipe-node " + cls;
    }

    function resetPipeVisual() {
      ["pnode-1","pnode-c1","pnode-2","pnode-c2","pnode-v","pnode-3","pnode-4","pnode-5"].forEach(id => setPipeNode(id, ""));
    }

    function getSheetPayload() {
      // Nếu đang ở chế độ file Excel, đồng bộ danh sách hạng mục từ dữ liệu bảng Excel người dùng sửa
      if (state.isExcelMode && state.excelRows && state.excelRows.length && state.columnMapping) {
        const colItem = state.columnMapping.item;
        const colSku = state.columnMapping.sku;
        const colSpec = state.columnMapping.spec;
        const colQty = state.columnMapping.qty;
        const colMand = state.columnMapping.mandatory;
        state.rows = state.excelRows.map(r => {
          let itemVal = String(r[colItem] || "").trim();
          let skuVal = colSku ? String(r[colSku] || "").trim() : "";
          let specVal = colSpec ? String(r[colSpec] || "").trim() : "";
          if (skuVal && !itemVal.toLowerCase().includes(skuVal.toLowerCase())) {
            itemVal = itemVal ? `${itemVal} (${skuVal})` : skuVal;
          }
          let qDigits = (String(r[colQty] || "1")).match(/\d+/);
          let cleanQty = qDigits ? qDigits[0] : "1";
          return {
            item: itemVal,
            spec: specVal || "Theo thông số file Excel",
            qty: cleanQty,
            mandatory: colMand ? String(r[colMand] || "").trim() : "Theo tiêu chuẩn chào thầu",
            raw_data: r
          };
        }).filter(r => r.item);
      }

      return {
        client: document.getElementById("shClient").value,
        deadline: document.getElementById("shDeadline").value,
        budget: document.getElementById("shBudget").value,
        discount: document.getElementById("shDiscount").value,
        sla: document.getElementById("shSla").value,
        rows: state.rows,
        columns: state.excelColumns || [],
        raw_rows: state.excelRows || []
      };
    }

    function showRightPane(which) {
      ["rightEmptyState", "rightFormatError", "rightUncleanError", "rightVerifyClean", "rightSuccessResult"].forEach(id => {
        document.getElementById(id).classList.toggle("hidden", id !== which);
      });
    }

    // ĐẨY BẤT KỲ FILE RAW NÀO VÀO AI AGENT -> KIỂM ĐỊNH DẠNG -> LÀM SẠCH -> CHỜ XÁC MINH
    async function ingestRawFile(input) {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      document.getElementById("rawFileStatus").textContent = "⏳ Đang đọc file: " + file.name;
      resetPipeVisual();
      setPipeNode("pnode-1", "active");
      document.getElementById("pipelineBadge").textContent = "ĐANG ĐỌC FILE...";

      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/ingest-raw-file", { method: "POST", body: fd });
        const data = await res.json();
        if (!data.ok) {
          showToast("❌ " + data.error);
          document.getElementById("rawFileStatus").textContent = "📎 Đẩy File Raw bất kỳ (.XLSX, .CSV, .DOCX, .PDF, .TXT)";
          return;
        }

        document.getElementById("rawFileStatus").textContent = "📄 Đã nạp file: " + data.filename;
        state.rawPreview = data.raw_preview || "";

        // Điền dữ liệu bóc tách vào bảng Sheet
        const ex = data.extracted_sheet;
        document.getElementById("shClient").value = ex.client || "";
        document.getElementById("shDeadline").value = ex.deadline || "";
        document.getElementById("shBudget").value = ex.budget || "0";
        document.getElementById("shDiscount").value = ex.discount || "0";
        document.getElementById("shSla").value = ex.sla || "";
        state.rows = ex.rows || [];

        // Nếu là file Excel, kích hoạt chế độ xem đúng theo cấu trúc cột gốc của file
        if (data.is_excel && data.columns && data.columns.length) {
          state.isExcelMode = true;
          state.excelColumns = data.columns;
          state.excelRows = data.raw_rows;
          state.columnMapping = data.column_mapping;
          document.getElementById("excelFileLabel").textContent = `${data.filename} (${data.columns.length} cột • ${data.raw_rows.length} dòng)`;
          renderExcelTable();
          setSheetViewMode("excel");
        } else {
          state.isExcelMode = false;
          renderSheetRows();
          setSheetViewMode("form");
        }
        switchLeftTab("sheet");

        setPipeNode("pnode-1", "done");
        if (!data.validation.valid_format) {
          setPipeNode("pnode-c1", "error");
          document.getElementById("pipelineBadge").textContent = "LỖI ĐỊNH DẠNG";
          document.getElementById("errFormatList").innerHTML = data.validation.errors.map(e => `<li>${e}</li>`).join("");
          showRightPane("rightFormatError");
          showToast("❌ File thiếu thông tin hoặc sai định dạng — vui lòng sửa lại!");
          return;
        }

        setPipeNode("pnode-c1", "done");
        setPipeNode("pnode-2", "done");
        state.cleanedData = data.cleaning.cleaned_data;
        if (!data.cleaning.is_clean) {
          setPipeNode("pnode-c2", "error");
          document.getElementById("pipelineBadge").textContent = "DỮ LIỆU CHƯA SẠCH";
          document.getElementById("errUncleanList").innerHTML = data.cleaning.unclean_issues.map(e => `<li>${e}</li>`).join("");
          showRightPane("rightUncleanError");
          showToast("⚠️ Có mục chưa chuẩn hóa được — quay về sửa lại!");
          return;
        }

        setPipeNode("pnode-c2", "done");
        showVerifyCleanScreen();
      } catch (e) {
        showToast("Lỗi tải file: " + e.message);
      } finally {
        input.value = "";
      }
    }

    // HIỂN THỊ XÁC NHẬN DỮ LIỆU SAU KHI LÀM SẠCH (GỌN GÀNG, ĐÚNG THEO FILE GỬI)
    function showVerifyCleanScreen() {
      const cd = state.cleanedData;
      if (!cd) return;
      setPipeNode("pnode-v", "active");
      document.getElementById("pipelineBadge").textContent = "CHỜ XÁC NHẬN DỮ LIỆU";

      const hasRaw = Boolean(state.rawPreview && state.rawPreview.trim());
      document.getElementById("rawPreviewWrap").classList.toggle("hidden", !hasRaw);
      if (hasRaw) document.getElementById("rawPreviewBox").textContent = state.rawPreview;

      document.getElementById("vcClient").value = cd.client || "";
      document.getElementById("vcDeadline").value = cd.deadline_days || 10;
      document.getElementById("vcBudget").value = cd.budget || 0;
      document.getElementById("vcDiscount").value = cd.discount_pct || 0;
      document.getElementById("vcSla").value = cd.sla || "8x5 Tiêu chuẩn NBD";

      document.getElementById("vcRowsBody").innerHTML = (cd.rows || []).map((r, i) => {
        let rawHtml = `<span class="text-stone-700 font-medium">${r.raw_item || r.clean_name}</span>`;
        if (r.raw_data && typeof r.raw_data === "object") {
          const chips = Object.entries(r.raw_data)
            .filter(([k, v]) => v !== "" && v !== null && !k.startsWith("_"))
            .slice(0, 4)
            .map(([k, v]) => `<span class="inline-block text-[9.5px] bg-stone-100 px-1.5 py-0.5 rounded mr-1 mb-0.5 text-stone-600"><strong>${k}:</strong> ${v}</span>`)
            .join("");
          if (chips) rawHtml = `<div class="max-w-xs">${chips}</div>`;
        }
        return `
          <tr>
            <td class="py-1.5 px-2">${rawHtml}</td>
            <td class="py-1.5 px-2 font-mono font-bold text-rose-600">${r.sku}</td>
            <td class="py-1.5 px-2"><input class="glass-input !py-1 !text-[11px]" value="${r.clean_name}" onchange="state.cleanedData.rows[${i}].clean_name=this.value" /></td>
            <td class="py-1.5 px-2"><input type="number" min="1" class="glass-input !py-1 !text-[11px]" value="${r.qty}" onchange="state.cleanedData.rows[${i}].qty=Number(this.value||1)" /></td>
          </tr>
        `;
      }).join("");

      showRightPane("rightVerifyClean");
      showToast("🛡️ Đã làm sạch xong — Vui lòng kiểm tra và xác nhận.");
    }

    async function confirmCleanAndAnalyze() {
      // Lấy lại mọi chỉnh sửa thủ công của người nhập tại bước xác minh
      if (state.cleanedData) {
        state.cleanedData.client = document.getElementById("vcClient").value.trim() || state.cleanedData.client;
        state.cleanedData.deadline_days = Number(document.getElementById("vcDeadline").value || 10);
        state.cleanedData.orig_deadline_days = state.cleanedData.deadline_days;
        state.cleanedData.budget = Number(document.getElementById("vcBudget").value || 0);
        state.cleanedData.discount_pct = Number(document.getElementById("vcDiscount").value || 0);
        state.cleanedData.orig_discount_pct = state.cleanedData.discount_pct;
        state.cleanedData.sla = document.getElementById("vcSla").value.trim() || "8x5 Tiêu chuẩn NBD";
        state.cleanedData.orig_sla = state.cleanedData.sla;
      }
      setPipeNode("pnode-v", "done");
      setPipeNode("pnode-3", "active");
      document.getElementById("pipelineBadge").textContent = "AI AGENT ĐANG PHÂN TÍCH...";
      state.retryCount = 0;
      await runAnalyzeStep("", false);
    }

    function rejectCleanBackToStep1() {
      setPipeNode("pnode-v", "error");
      switchLeftTab("sheet");
      showRightPane("rightEmptyState");
      document.getElementById("pipelineBadge").textContent = "NGƯỜI NHẬP YÊU CẦU SỬA LẠI";
      showToast("✏️ Đã quay lại Bước 1 để bạn chỉnh sửa lại dữ liệu gốc!");
    }

    // CHẠY TOÀN BỘ LUỒNG: NHẬP SHEET -> KIỂM TRA -> LÀM SẠCH -> NGƯỜI NHẬP XÁC MINH -> AI PHÂN TÍCH
    async function startFullPipeline() {
      const btn = document.getElementById("runPipelineBtn");
      btn.disabled = true;
      btn.innerHTML = `<div class="spinner"></div><span>AI Agent đang chạy quy trình...</span>`;
      resetPipeVisual();
      state.rawPreview = "";

      try {
        const payload = getSheetPayload();
        setPipeNode("pnode-1", "done");
        setPipeNode("pnode-c1", "active");
        document.getElementById("pipelineBadge").textContent = "ĐANG KIỂM TRA ĐỊNH DẠNG...";

        await new Promise(r => setTimeout(r, 220));
        const valRes = await fetch("/api/validate-sheet", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        const valData = await valRes.json();

        if (!valData.valid_format) {
          setPipeNode("pnode-c1", "error");
          document.getElementById("pipelineBadge").textContent = "LỖI ĐỊNH DẠNG SHEET";
          document.getElementById("errFormatList").innerHTML = valData.errors.map(e => `<li>${e}</li>`).join("");
          showRightPane("rightFormatError");
          showToast("❌ Sai định dạng Sheet — vui lòng nhập lại!");
          return;
        }

        setPipeNode("pnode-c1", "done");
        setPipeNode("pnode-2", "active");
        document.getElementById("pipelineBadge").textContent = "ĐANG LÀM SẠCH DỮ LIỆU...";
        await new Promise(r => setTimeout(r, 220));

        const cleanRes = await fetch("/api/clean-sheet", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        const cleanData = await cleanRes.json();
        state.cleanedData = cleanData.cleaned_data;

        if (!cleanData.is_clean) {
          setPipeNode("pnode-2", "done");
          setPipeNode("pnode-c2", "error");
          document.getElementById("pipelineBadge").textContent = "DỮ LIỆU CHƯA SẠCH";
          document.getElementById("errUncleanList").innerHTML = cleanData.unclean_issues.map(e => `<li>${e}</li>`).join("");
          showRightPane("rightUncleanError");
          showToast("⚠️ Dữ liệu chưa sạch — quay lại Bước 1!");
          return;
        }

        setPipeNode("pnode-2", "done");
        setPipeNode("pnode-c2", "done");
        // Dừng ở Bước 2.5 để Người nhập xác minh dữ liệu sau khi làm sạch
        showVerifyCleanScreen();
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4"></i><span>Kích hoạt AI Agent Xử lý Quy trình</span>`;
        lucide.createIcons();
      }
    }

    async function runAnalyzeStep(extraNote, autoOptimize = false) {
      const anRes = await fetch("/api/analyze-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cleaned_data: state.cleanedData,
          extra_feedback_note: extraNote,
          retry_count: state.retryCount,
          max_retries: 2,
          auto_optimize: autoOptimize
        })
      });
      const ev = await anRes.json();
      state.evalResult = ev;

      // Đồng bộ lại các thông số đã được AI điều chỉnh để không lặp lại lỗi cũ
      if (state.cleanedData) {
        state.cleanedData.discount_pct = ev.discount_pct;
        state.cleanedData.deadline_days = ev.deadline_days;
        state.cleanedData.sla = ev.sla_requirement;
      }

      setPipeNode("pnode-3", "done");
      setPipeNode("pnode-4", "active");
      document.getElementById("pipelineBadge").textContent = ev.loop_limit_reached
        ? "ĐÃ NGẮT VÒNG LẶP — CHỜ CON NGƯỜI"
        : "CHỜ XÁC NHẬN FEEDBACK";

      // Update Top KPI
      document.getElementById("kpiLivePrice").textContent = fmtMoney(ev.final_price);
      document.getElementById("kpiLiveAuth").textContent = ev.approval_level;
      document.getElementById("kpiLiveLead").textContent = `${ev.max_lead_days} / ${ev.deadline_days} ngày`;

      // Render Result Panes
      showRightPane("rightSuccessResult");
      document.getElementById("rightClientTag").textContent = ev.client;
      document.getElementById("resReadyList").innerHTML = ev.ready_to_quote_parts.length
        ? ev.ready_to_quote_parts.map(x => `<li>${x}</li>`).join("")
        : `<li>Chưa có mục sẵn ngay.</li>`;
      document.getElementById("resVerifyList").innerHTML = ev.must_verify_parts.length
        ? ev.must_verify_parts.map(x => `<li>${x}</li>`).join("")
        : `<li>Không có mục nào cần xác minh thêm!</li>`;

      document.getElementById("resStockTable").innerHTML = ev.feasibility_rows.map(r => `
        <tr>
          <td class="py-1.5 font-semibold text-stone-800">${r.name}</td>
          <td class="py-1.5">${r.qty}</td>
          <td class="py-1.5">${r.stock}</td>
          <td class="py-1.5 font-bold">${fmtMoney(r.total_price)}</td>
          <td class="py-1.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.is_ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">${r.status}</span></td>
        </tr>
      `).join("");

      document.getElementById("resFeedbackList").innerHTML = ev.feedback_summary.map(f => `<li>${f}</li>`).join("");

      // Cập nhật bộ đếm chống lặp vô hạn ở tab Feedback
      const attemptDisplay = Math.min(ev.retry_count + 1, ev.max_retries + 1);
      document.getElementById("retryCounterBadge").textContent = `Lần kiểm tra: ${ev.retry_count}/${ev.max_retries} (tối đa)`;
      const limitHit = Boolean(ev.loop_limit_reached);
      document.getElementById("loopBreakerAlert").classList.toggle("hidden", !limitHit);
      document.getElementById("feedbackInputWrap").classList.toggle("hidden", limitHit);
      document.getElementById("btnReanalyze").classList.toggle("hidden", limitHit);

      document.getElementById("outFinalPrice").textContent = fmtMoney(ev.final_price);
      document.getElementById("outLead").textContent = `${ev.max_lead_days} ngày`;
      document.getElementById("outManday").textContent = `${ev.total_mandays} công`;
      document.getElementById("outAuth").textContent = ev.approval_level;

      const tot = Math.max(1, ev.hardware_cost + ev.service_cost);
      const hwPct = Math.round((ev.hardware_cost / tot) * 100);
      document.getElementById("outBarHw").style.width = hwPct + "%";
      document.getElementById("outBarSvc").style.width = (100 - hwPct) + "%";
      document.getElementById("outLblHw").textContent = `Phần cứng: ${fmtMoney(ev.hardware_cost)}`;
      document.getElementById("outLblSvc").textContent = `Dịch vụ & SLA: ${fmtMoney(ev.service_cost)}`;

      const hasNotice = (ev.customer_change_notices && ev.customer_change_notices.length > 0);
      document.getElementById("customerNoticeCard").classList.toggle("hidden", !hasNotice);
      document.getElementById("customerNoticeDraft").value = ev.customer_notice_draft || "";

      switchRightTab(state.retryCount > 0 ? "feedback" : "analysis");
      showToast(state.retryCount > 0 ? `🔄 Đã phân tích lại (lần ${state.retryCount}/2)!` : "✅ AI Agent đã phân tích xong!");
    }

    function copyCustomerNotice() {
      const el = document.getElementById("customerNoticeDraft");
      el.select();
      navigator.clipboard.writeText(el.value);
      showToast("📋 Đã copy Thư thông báo điều chỉnh gửi khách hàng!");
    }

    function acceptFeedback() {
      setPipeNode("pnode-4", "done");
      setPipeNode("pnode-5", "done");
      document.getElementById("pipelineBadge").textContent = "HOÀN TẤT • SẴN SÀNG XUẤT";
      switchRightTab("output");
      showToast("🎉 Feedback OK! Đã mở khóa Xuất Báo cáo & Dashboard.");
    }

    async function reanalyzeFeedback() {
      if (state.retryCount >= 2) {
        showToast("⛔ Đã đạt giới hạn 2 lần phân tích lại — vui lòng sửa Sheet gốc!");
        return;
      }
      state.retryCount += 1;
      const note = document.getElementById("fbAdjustInput").value.trim();
      document.getElementById("fbAdjustInput").value = "";
      setPipeNode("pnode-3", "active");
      showToast(`🔄 Đang điều chỉnh & phân tích lại (lần ${state.retryCount}/2)...`);
      await runAnalyzeStep(note, true);
    }

    function backToSheetEdit() {
      state.retryCount = 0;
      switchLeftTab("sheet");
      setPipeNode("pnode-1", "active");
      document.getElementById("pipelineBadge").textContent = "ĐANG SỬA SHEET GỐC";
      showToast("✏️ Hãy chỉnh sửa lại dữ liệu Sheet bên trái rồi bấm Kích hoạt AI Agent!");
    }

    function switchRightTab(tab) {
      ["analysis", "feedback", "output"].forEach(t => {
        document.getElementById("rpane-" + t).classList.toggle("hidden", t !== tab);
        document.getElementById("rtab-" + t).className = t === tab
          ? "px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-stone-900 shadow-sm border-0 cursor-pointer"
          : "px-3 py-1.5 rounded-lg bg-transparent text-xs font-semibold text-stone-600 border-0 cursor-pointer";
      });
    }

    function focusStep(step) {
      if (step === 1) switchLeftTab("sheet");
      if (step === 3 && state.evalResult) switchRightTab("analysis");
      if (step === 4 && state.evalResult) switchRightTab("feedback");
      if (step === 5 && state.evalResult) switchRightTab("output");
    }

    function switchView(v) {
      ["pipeline", "catalog", "policy", "history"].forEach(id => {
        document.getElementById("view-" + id).classList.toggle("hidden", id !== v);
      });
      document.querySelectorAll(".nav-pill").forEach(el => el.classList.remove("active"));
      const nav = document.getElementById("nav-" + v);
      if (nav) nav.classList.add("active");
    }

    function resetAll() {
      resetPipeVisual();
      setPipeNode("pnode-1", "active");
      showRightPane("rightEmptyState");
      document.getElementById("pipelineBadge").textContent = "SẴN SÀNG TIẾP NHẬN";
      showToast("Đã làm mới trạng thái!");
    }

    async function downloadDocx() {
      if (!state.evalResult) return;
      const res = await fetch("/api/export-docx", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state.evalResult)
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bao_Gia_ThienMinh_${(state.evalResult.client || "DuAn").replace(/\s+/g, "_")}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("📄 Đang tải Báo cáo Word (.DOCX)!");
    }

    async function saveDossier() {
      if (!state.evalResult) return;
      const res = await fetch("/api/save-dossier", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluation: state.evalResult, status: "ISSUED" })
      });
      const data = await res.json();
      state.dossiers = data.dossiers || [];
      renderHistory();
      showToast(`💾 Đã lưu hồ sơ ${data.dossier_code}!`);
    }

    function renderCatalog() {
      document.getElementById("catalogTableBody").innerHTML = state.catalog.map(c => `
        <tr>
          <td class="py-2 font-mono text-rose-600 font-semibold">${c.sku}</td>
          <td class="py-2 font-semibold">${c.name}</td>
          <td class="py-2">${c.category || ""}</td>
          <td class="py-2 font-bold">${fmtMoney(c.unit_price)}</td>
          <td class="py-2">${c.stock}</td>
          <td class="py-2">${c.lead_time_days} ngày</td>
        </tr>
      `).join("");
    }

    function renderHistory() {
      const tb = document.getElementById("historyTableBody");
      const sb = document.getElementById("recentSidebarList");
      if (!state.dossiers.length) {
        tb.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-stone-400">Chưa có hồ sơ nào được lưu.</td></tr>`;
        return;
      }
      tb.innerHTML = state.dossiers.map(d => `
        <tr>
          <td class="py-2 font-mono font-bold text-rose-600">${d.dossier_code}</td>
          <td class="py-2 font-semibold">${d.client_name}</td>
          <td class="py-2">${d.deadline_days} ngày</td>
          <td class="py-2">${d.discount_requested}%</td>
          <td class="py-2 font-bold">${fmtMoney(d.final_bid_price)}</td>
          <td class="py-2">${d.approval_level}</td>
          <td class="py-2"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">${d.status}</span></td>
        </tr>
      `).join("");
      sb.innerHTML = state.dossiers.slice(0, 4).map(d => `
        <div class="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-[11px]">
          <div class="font-bold text-white truncate">${d.client_name}</div>
          <div class="text-white/60 text-[10px]">${d.dossier_code} • ${fmtMoney(d.final_bid_price)}</div>
        </div>
      `).join("");
    }

    async function sendChat(e) {
      e.preventDefault();
      const inp = document.getElementById("chatInp");
      const text = inp.value.trim();
      if (!text) return;
      inp.value = "";
      const box = document.getElementById("chatMsgs");
      box.innerHTML += `<div class="ml-auto max-w-[85%] p-2.5 rounded-xl bg-rose-500 text-white">${text}</div>`;
      box.scrollTop = box.scrollHeight;
      state.chatHistory.push({ role: "user", content: text });

      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: state.chatHistory, context: state.evalResult || {} })
      });
      const data = await res.json();
      state.chatHistory.push({ role: "assistant", content: data.reply });
      const formatted = data.reply.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
      box.innerHTML += `<div class="p-2.5 rounded-xl bg-white/10 text-white/95">${formatted}</div>`;
      box.scrollTop = box.scrollHeight;
    }

    bootstrap();
  
"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var dialog_1 = require("@/components/ui/dialog");
var button_1 = require("@/components/ui/button");
var label_1 = require("@/components/ui/label");
var lucide_react_1 = require("lucide-react");
function ImportDataModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onImport = _a.onImport;
    var _b = react_1.useState(null), file = _b[0], setFile = _b[1];
    var _c = react_1.useState(false), processing = _c[0], setProcessing = _c[1];
    var _d = react_1.useState([]), preview = _d[0], setPreview = _d[1];
    var _e = react_1.useState("Employees"), selectedType = _e[0], setSelectedType = _e[1];
    var _f = react_1.useState(false), isDragging = _f[0], setIsDragging = _f[1];
    var handleFileChange = function (e) {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            previewFile(e.target.files[0]);
        }
    };
    var handleDragOver = function (e) {
        e.preventDefault();
        setIsDragging(true);
    };
    var handleDragLeave = function (e) {
        e.preventDefault();
        setIsDragging(false);
    };
    var handleDrop = function (e) {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            previewFile(e.dataTransfer.files[0]);
        }
    };
    var previewFile = function (file) {
        setProcessing(true);
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            try {
                var data = [];
                if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                    // Simple CSV parsing (would be more robust in production)
                    var csvContent = e.target.result;
                    var lines = csvContent.split("\n");
                    var headers = lines[0].split(",");
                    var _loop_1 = function (i) {
                        if (!lines[i].trim())
                            return "continue";
                        var values = lines[i].split(",");
                        var persona = {
                            id: Date.now().toString() + i,
                            isFavorite: false,
                            status: "Active",
                            added: new Date().toISOString().split("T")[0],
                            type: selectedType
                        };
                        headers.forEach(function (header, index) {
                            var key = header.trim();
                            if (values[index]) {
                                persona[key] = values[index].trim();
                            }
                        });
                        data.push(persona);
                    };
                    for (var i = 1; i < lines.length; i++) {
                        _loop_1(i);
                    }
                }
                setPreview(data.slice(0, 3)); // Preview first 3 items
                setProcessing(false);
            }
            catch (error) {
                console.error("Error parsing file:", error);
                setProcessing(false);
            }
        };
        reader.readAsText(file);
    };
    var handleImport = function () {
        var _a;
        if (file) {
            // Check file extension
            var fileExtension_1 = (_a = file.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (fileExtension_1 === 'csv') {
                // Handle CSV file
                var reader = new FileReader();
                reader.onload = function (e) {
                    var _a;
                    try {
                        if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                            // Get the raw CSV content
                            var csvContent = e.target.result;
                            // Send the raw CSV data to backend
                            fetch('http://localhost:5500/import-data', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'text/csv',
                                    'X-File-Type': 'csv',
                                    'Type': selectedType
                                },
                                body: csvContent
                            })
                                .then(handleResponse)["catch"](handleError);
                        }
                    }
                    catch (error) {
                        console.error("Error importing file:", error);
                    }
                };
                reader.readAsText(file);
            }
            else if (fileExtension_1 === 'xlsx' || fileExtension_1 === 'xls') {
                // Handle Excel file - need to send as binary
                var reader = new FileReader();
                reader.onload = function (e) {
                    var _a;
                    try {
                        if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                            // Send the binary Excel data to backend
                            fetch('http://localhost:5500/import-data', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/octet-stream',
                                    'X-File-Type': fileExtension_1,
                                    'Type': selectedType
                                },
                                body: e.target.result
                            })
                                .then(handleResponse)["catch"](handleError);
                        }
                    }
                    catch (error) {
                        console.error("Error importing file:", error);
                    }
                };
                reader.readAsArrayBuffer(file); // Read as binary for Excel files
            }
            else {
                alert('Unsupported file format. Please upload a CSV or Excel file.');
            }
        }
    };
    // Helper functions for handling response/error
    var handleResponse = function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json().then(function (responseData) {
            console.log('Success:', responseData);
            resetForm();
            onClose();
        });
    };
    var handleError = function (error) {
        console.error('Error sending data to server:', error);
        alert('Error sending data to server: ' + error.message);
    };
    var resetForm = function () {
        setFile(null);
        setPreview([]);
        setProcessing(false);
    };
    var handleButtonClick = function () {
        inputRef.current.click();
    };
    return (React.createElement(dialog_1.Dialog, { open: isOpen, onOpenChange: function (open) {
            if (!open) {
                resetForm();
                onClose();
            }
        } },
        React.createElement(dialog_1.DialogContent, { className: "sm:max-w-[600px]" },
            React.createElement(dialog_1.DialogHeader, null,
                React.createElement(dialog_1.DialogTitle, { className: "flex items-center gap-2" },
                    React.createElement(lucide_react_1.FileSpreadsheet, { className: "h-5 w-5" }),
                    "Import Persona Data")),
            React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, null, "Persona Type"),
                    React.createElement("select", { className: "w-full p-2 border rounded-md", value: selectedType, onChange: function (e) { return setSelectedType(e.target.value); } },
                        React.createElement("option", { value: "Employees" }, "Employees"),
                        React.createElement("option", { value: "Vendors" }, "Vendors"),
                        React.createElement("option", { value: "Customers" }, "Customers"),
                        React.createElement("option", { value: "Other" }, "Other"))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement(label_1.Label, null, "Upload CSV file"),
                    React.createElement("div", { className: "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors " + (isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"), onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop },
                        React.createElement(lucide_react_1.FileSpreadsheet, { className: "h-8 w-8 text-gray-400 mb-2" }),
                        React.createElement("p", { className: "text-sm text-gray-500 mb-2" }, "Drag and drop your CSV file here"),
                        React.createElement("label", { className: "cursor-pointer" },
                            React.createElement("input", { type: "file", accept: ".csv", className: "sr-only", onChange: handleFileChange })),
                        file && (React.createElement("p", { className: "mt-2 text-sm text-gray-600" },
                            "Selected: ",
                            file.name)))),
                React.createElement("div", { className: "text-sm text-gray-500" },
                    React.createElement("p", null, "CSV should have headers with these fields:"),
                    React.createElement("p", null, "name, email, phone, location, role, department, etc.")),
                React.createElement("div", { className: "flex gap-2 flex-wrap pt-2" },
                    React.createElement("a", { href: "/vendors_sample.xlsx", download: true },
                        React.createElement("button", { className: "bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition" }, "Vendors Sample")),
                    React.createElement("a", { href: "/employee.xlsx", download: true },
                        React.createElement("button", { className: "bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition" }, "Employee Sample")),
                    React.createElement("a", { href: "/customers_sample.xlsx", download: true },
                        React.createElement("button", { className: "bg-purple-500 text-white text-sm px-3 py-1 rounded hover:bg-purple-600 transition" }, "Customer Sample")))),
            preview.length > 0 && (React.createElement("div", { className: "mt-4 p-4 border rounded-md bg-gray-50" },
                React.createElement("h3", { className: "font-medium mb-2" },
                    "Preview (",
                    preview.length,
                    " items):"),
                React.createElement("div", { className: "space-y-2 text-sm max-h-[200px] overflow-y-auto" }, preview.map(function (item, index) { return (React.createElement("div", { key: index, className: "p-2 border rounded bg-white" },
                    React.createElement("p", null,
                        React.createElement("span", { className: "font-medium" }, "Name:"),
                        " ",
                        item.name),
                    React.createElement("p", null,
                        React.createElement("span", { className: "font-medium" }, "Type:"),
                        " ",
                        item.type),
                    item.email && (React.createElement("p", null,
                        React.createElement("span", { className: "font-medium" }, "Email:"),
                        " ",
                        item.email)),
                    item.location && (React.createElement("p", null,
                        React.createElement("span", { className: "font-medium" }, "Location:"),
                        " ",
                        item.location)))); })))),
            React.createElement(dialog_1.DialogFooter, { className: "mt-6" },
                React.createElement(button_1.Button, { variant: "outline", onClick: onClose }, "Cancel"),
                React.createElement(button_1.Button, { onClick: handleImport, disabled: !file }, "Import Data")))));
}
exports["default"] = ImportDataModal;

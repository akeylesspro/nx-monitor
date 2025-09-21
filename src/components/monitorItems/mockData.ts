/// mock data
export const getChartData = (mockData: { label: string; value: number }[] = []) => {
    const chartData = {
        labels: mockData.map((item) => item.label),
        datasets: [
            {
                label: "",
                data: mockData.map((item) => item.value),
            },
        ],
    };
    return chartData;
};

export const getTableData = () => {
    return [
        {
            code: "https://akeyless-toolbox.online",
            name: "Monitor Display",
            category: "Hardware",
            quantity: 15,
            price: "$299.99",
            description: "27-inch 4K LED monitor with excellent color accuracy",
            supplier: "TechCorp Ltd",
            location: "Warehouse A-1",
        },
        {
            code: "P002",
            name: "Keyboard",
            category: "Peripherals",
            quantity: 25,
            price: "$89.99",
            description: "Mechanical gaming keyboard with RGB backlighting",
            supplier: "GamingGear Inc",
            location: "Warehouse B-2",
        },
        {
            code: "P003",
            name: "Mouse",
            category: "Peripherals",
            quantity: 30,
            price: "$49.99",
            description: "Wireless optical mouse with ergonomic design",
            supplier: "GamingGear Inc",
            location: "Warehouse B-3",
        },
        {
            code: "P004",
            name: "CPU",
            category: "Hardware",
            quantity: 8,
            price: "$399.99",
            description: "Intel Core i7-12700K 12-core processor",
            supplier: "TechCorp Ltd",
            location: "Warehouse A-2",
        },
        {
            code: "P005",
            name: "RAM Memory",
            category: "Hardware",
            quantity: 20,
            price: "$129.99",
            description: "32GB DDR4-3200 memory module",
            supplier: "MemoryMax Corp",
            location: "Warehouse C-1",
        },
        {
            code: "P006",
            name: "Graphics Card",
            category: "Hardware",
            quantity: 5,
            price: "$799.99",
            description: "NVIDIA RTX 4070 12GB GDDR6X",
            supplier: "TechCorp Ltd",
            location: "Warehouse A-3",
        },
        {
            code: "P007",
            name: "Motherboard",
            category: "Hardware",
            quantity: 12,
            price: "$199.99",
            description: "ATX motherboard with PCIe 5.0 support",
            supplier: "TechCorp Ltd",
            location: "Warehouse A-4",
        },
        {
            code: "P008",
            name: "Power Supply",
            category: "Hardware",
            quantity: 18,
            price: "$149.99",
            description: "850W 80+ Gold modular power supply",
            supplier: "PowerTech Solutions",
            location: "Warehouse D-1",
        },
        {
            code: "P009",
            name: "SSD Storage",
            category: "Storage",
            quantity: 35,
            price: "$199.99",
            description: "1TB NVMe SSD with 7000MB/s read speed",
            supplier: "StoragePro Inc",
            location: "Warehouse E-1",
        },
        {
            code: "P010",
            name: "Webcam",
            category: "Peripherals",
            quantity: 22,
            price: "$79.99",
            description: "4K webcam with auto-focus and noise cancellation",
            supplier: "GamingGear Inc",
            location: "Warehouse B-4",
        },
    ];
};

export const getListData = (): string[] => {
    return [
        "https://akeyless-toolbox.online",
        "232323232",
        "3sasasa sasas asasas xlfkvbjuxcjdfkvhn km,jb ncxfmjbnm ,kcxgbjnkm",
        "sa dasd sa das",
        "666 fdt76",
        "12232",
        "232323232",
        "3sasasa sasas asasas",
        "sa dasd sa das",
        "666 fdt76",
        "12232",
        "232323232",
        "3sasasa sasas asasas",
        "sa dasd sa das",
        "666 fdt76",
    ];
};

import {useEffect, useState} from "react";

interface ApexData {
    // master_information.instrument_xref.isin
// debt.floating_rate_instruments.FRI_formula_reset[].formula[].part[].outer_benchmark_rate_const,
// debt.floating_rate_instruments.FRI_formula_reset[].formula[].description
    master_information: {
        instrument_xref: {
            isin: string
        }
    }
    debt: {
        floating_rate_instruments: {
            FRI_formula_reset: Array<{
                formula: Array<{
                    description: string,
                    part: Array<{
                        outer_benchmark_rate_const: string,
                    }>
                }>
            }>
        }
    }
}
export default function Parser() {

    const [file, setFile] = useState<File>();
    const [showingWords, setShowingWords] = useState<string>("");
    const [processedData, setProcessedData] = useState<string>("");

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setFile(file);
    };

    useEffect(() => {

        if (file) {
            handleProcessFile();
        }
    }, [file]);

    const handleProcessFile = async () => {
        try {
            setShowingWords("處理中")
            // 在這裡執行您的邏輯處理，例如讀取檔案、處理它並設定處理完的數據
            const lines: string[] = [];
            const text = await file?.text()
            if (text) {
                const dataList: ApexData[] = JSON.parse(text);
                lines.push(`"isin","description","outerBenchmarkRateConst"`);
                dataList.forEach(data => {
                    const isin = data.master_information.instrument_xref.isin;
                    console.log(`process isin: ${isin} ...`);
                    data.debt.floating_rate_instruments.FRI_formula_reset.forEach((item) => {
                        item.formula.forEach((item) => {
                            const description = item.description;
                            item.part.forEach((item) => {
                                const outerBenchmarkRateConst = item.outer_benchmark_rate_const;
                                lines.push(`"${isin}","${description}","${outerBenchmarkRateConst}"`);
                            })
                        })
                    });
                    console.log(`process isin: ${isin} done!`);
                });
            } else {
                setShowingWords("檔案空白")
                return;
            }
            setProcessedData(lines.join("\n"));
            setShowingWords("處理完成")
        } catch (error) {
            setShowingWords("檔案格式錯誤")
        }
    };

    function downloadFile(processedData: string, fileName = "xxx.txt") {
        const blob = new Blob([processedData], {type: "application/octet-stream"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // 下載檔案的名稱
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const handleDownload = () => {
        // 創建一個Blob對象並生成下載連結
        downloadFile(processedData, "apex_json_parse.csv");
    };


    return (
        <div >
            <div>
                <input type="file" onChange={handleFileChange}/>
                <span>{showingWords}</span>
            </div>
            <div>
                <button onClick={handleDownload} disabled={!processedData}>下載處理完的檔案</button>
            </div>
        </div>
    );

}

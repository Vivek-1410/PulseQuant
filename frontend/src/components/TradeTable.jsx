function TradeTable({ trades }) {

    return (

        <table
            style={{
                width:"100%",
                borderCollapse:"collapse",
                color:"white"
            }}
        >

            <thead>

            <tr>

                <th>Type</th>

                <th>Strategy</th>

                <th>Entry</th>

                <th>Exit</th>

                <th>PnL</th>

            </tr>

            </thead>

            <tbody>

            {

                trades.map((trade,index)=>(

                    <tr
                        key={index}
                    >

                        <td>{trade.Type}</td>

                        <td>{trade.Strategy}</td>

                        <td>{trade["Entry Price"]}</td>

                        <td>{trade["Exit Price"]}</td>

                        <td
                            style={{
                                color:
                                trade["Net PnL"]>=0
                                ?
                                "#0ECB81"
                                :
                                "#F6465D"
                            }}
                        >

                        {trade["Net PnL"]}

                        </td>

                    </tr>

                ))

            }

            </tbody>

        </table>

    );

}

export default TradeTable;
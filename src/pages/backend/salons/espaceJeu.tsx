const EspaceJeux =  () => {
    return <div className="page-wrapper">
    <div className="page-wrapper-header">
        <div className="page-wrapper-header-title">
            <h2>Nom du salon</h2>
        </div>
        <div className="page-wrapper-header-action">
            
        </div>
    </div>

    <div className="page-wrapper-espace-jeux">
            <div className="page-wrapper-espace-jeux-content">
                Consle de jeu
            </div>
            <div className="page-wrapper-espace-jeux-tchat">
                <div className="message-content">
                    <div className="message-sender">Salut ça va?</div>
                    <div className="message-receiver">Ça va et toi?</div>
                </div>
                <div className="input-message">
                    <input type="text" name="" placeholder="Message..." />
                </div>
            </div>
        </div>

    </div>
}

export default EspaceJeux;
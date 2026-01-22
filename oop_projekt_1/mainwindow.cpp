#include "mainwindow.h"
#include "./ui_mainwindow.h"
#include <QFontDialog>
#include <QColorDialog>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    timer=new QTimer(this);
    connect(timer,&QTimer::timeout,this,&MainWindow::updateTime);
    timer->start(1000);
    updateTime();
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_settingsButton_clicked()
{
    bool ok;
    //Odabir fonta:
    QFont font=QFontDialog::getFont(
        &ok,
        ui->timeLabel->font(),
        this,
        "Odaberi font:"
        );
    if(ok){
        ui->timeLabel->setFont(font);
    }
    QColor color = QColorDialog::getColor(
        ui->timeLabel->palette().color(QPalette::WindowText),
        this,
        "Odaberi boju teksta"
        );

    if (color.isValid()) {
        QPalette palette = ui->timeLabel->palette();
        palette.setColor(QPalette::WindowText, color);
        ui->timeLabel->setPalette(palette);
    }
}
void MainWindow::updateTime(){
    QTime time=QTime::currentTime();
    ui->timeLabel->setText(time.toString("HH:mm:ss"));
}
